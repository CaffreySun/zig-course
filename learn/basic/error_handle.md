---
outline: deep
---

# 错误处理

程序会在某些时候因为某些我们知道或者不知道的原因出错，有的错误我们可以预知并处理，有些错误我们无法预知，但我们可以捕获它们并有效地报告给用户。

:::info 🅿️ 提示

事实上，目前 zig 的错误处理方案笔者认为是比较简陋的，因为错误类型在 zig 中只是略微加工后的 `enum`，这导致错误类型无法携带有效的 `payload`，你只能通过 error 的 tagName 来获取有效的信息。

:::

以下展示了 error 的基本定义和使用：

```zig
const std = @import("std");

const FileOpenError = error{
    AccessDenied,
    OutOfMemory,
    FileNotFound,
};

const AllocationError = error{
    OutOfMemory,
};

pub fn main() !void {
    const err = foo(AllocationError.OutOfMemory);
    if (err == FileOpenError.OutOfMemory) {
        std.debug.print("error is OutOfMemory\n", .{});
    }
}

fn foo(err: AllocationError) FileOpenError {
    return err;
}
```

以上代码使用 `error` 关键字定义了两个错误类型，分别是：`FileOpenError` 和 `AllocationError`，这两个类型实现了几种错误的定义。

注意，我们可以定义多个重复的错误 tagName，它们均会分配一个大于 0 的值，多个重复的错误 tagName 的值是相同的，同时 error 还支持将错误从子集转换到超集，这里我们就是将子集 `AllocationError` 通过函数 `foo` 转换到超集 `FileOpenError`。

## 只有一个值的错误集

如果你打算定义一个只有一个值的错误集，我们这时再使用以上的定义方法未免过于啰嗦，zig 提供了一种简短方式来定义：

```zig
const err = error.FileNotFound;
```

以上这行代码相当于：

```zig
const err = (error {FileNotFound}).FileNotFound;
```

## 全局错误集

`anyerror` 指的是全局的错误集合，它包含编译单元中的所有错误集，即超集不是子集。

你可以将所有的错误强制转换到 `anyerror`，也可以将 `anyerror` 转换到所有错误集，并在转换时增加一个语言级断言（language-level assert）保证错误一定是目标错误集的值。

::: warning ⚠️ 警告

应尽量避免使用 `anyerror`，因为它会阻止编译器在编译期就检测出可能存在的错误，增加代码出错 debug 的负担。

:::

## 错误联合类型

！！！以上所说的错误类型实际上用的大概不多，但错误联合类型大概是你经常用的。

只需要在普通类型的前面增加一个 `!` 就是代表这个类型变成错误联合类型，我们来看一个比较简单的函数：

以下是一个将英文字符串解析为数字的示例：

```zig
const std = @import("std");
const maxInt = std.math.maxInt;

pub fn parseU64(buf: []const u8, radix: u8) !u64 {
    var x: u64 = 0;

    for (buf) |c| {
        const digit = charToDigit(c);

        if (digit >= radix) {
            return error.InvalidChar;
        }

        // x *= radix
        var ov = @mulWithOverflow(x, radix);
        if (ov[1] != 0) return error.OverFlow;

        // x += digit
        ov = @addWithOverflow(ov[0], digit);
        if (ov[1] != 0) return error.OverFlow;
        x = ov[0];
    }

    return x;
}

fn charToDigit(c: u8) u8 {
    return switch (c) {
        '0' ... '9' => c - '0',
        'A' ... 'Z' => c - 'A' + 10,
        'a' ... 'z' => c - 'a' + 10,
        else => maxInt(u8),
    };
}
```

注意函数的返回值：`!u64`，这意味函数返回的是一个 `u64` 或者是一个 `error`，错误集在这里被保留在 `!` 左侧，因此该错误集是可以被编译器自动推导的。

事实上，函数无论是返回 `u64` 还是返回 `error`，均会被转换为 `anyerror!u64`。

该函数的具体效果取决于我们如何对待返回的 `error`:

1. 返回错误时我们准备一个默认值
2. 返回错误时我们想将它向上传递
3. 确信本次函数执行后肯定不会发生错误，想要无条件的解构它
4. 针对不同的错误采取不同的处理方式

### `catch`

`catch` 用于发生错误时提供一个默认值，来看一个例子：

```zig
// 接着上面的函数写

fn doAThing(str: []u8) void {
    const number = parseU64(str, 10) catch 13;
    _ = number; // ...
}
```

`number` 将一定是一个 `u64` 的值，当发生错误时，将会提供默认值 13 给 `number`。

:::info 🅿️ 提示

`catch` 运算符右侧必须是一个与其左侧函数返回的错误联合类型展开后的类型一致，或者是一个 `noreturn`(例如panic) 的语句。

:::

当然进阶点我们还可以和命名（named Blocks）功能结合起来：

```zig
// 接着上面的函数写

const number = parseU64(str, 10) catch blk: {
    // do things
    break :blk 13;
};
```

### try

`try` 用于在出现错误时直接向上层返回错误，没错误就正常执行：

::: code-group

```zig [try]
fn doAThing(str: []u8) !void {
    const number = try parseU64(str, 10);
    _ = number; // ...
}
```

```zig [catch 实现]
fn doAThing(str: []u8) !void {
    const number = parseU64(str, 10) catch |err| return err;
    _ = number; // ...
}
```

:::

`try` 会尝试计算联合类型表达式，如果是错误从当前函数向上返回，否则解构它。

::: info 🅿️ 提示

那么如何假定函数不会返回错误呢？

使用 `unreachable`，这会告诉编译器此次函数执行不会返回错误，`unreachable` 在 `Debug` 和 `ReleaseSafe` 模式下会产生恐慌，在 `ReleaseFast` 和 `ReleaseSmall` 模式下会产生未定义的行为。所以当调试应用程序时，如果函数执行到了这里，那就会发生 `panic`。

```zig
const number = parseU64("1234", 10) catch unreachable;
```

:::

::: details 更加进阶的错误处理方案

有时我们需要针对不同的错误做更为细致的处理，这时我们可以将 `if` 和 `switch` 联合起来：

```zig
fn doAThing(str: []u8) void {
    if (parseU64(str, 10)) |number| {
        doSomethingWithNumber(number);
    } else |err| switch (err) {
        error.Overflow => {
            // 处理溢出
        },
        // 此处假定这个错误不会发生
        error.InvalidChar => unreachable,
        // 这里你也可以使用 else 来捕获额外的错误
        // else => |leftover_err| return leftover_err,
    }
}
```

:::

::: details 不处理错误

如果不想处理错误怎么办呢？

直接在捕获错误的地方使用 `_` 来通知编译器忽略它即可。

```zig
fn doADifferentThing(str: []u8) void {
    if (parseU64(str, 10)) |number| {
        doSomethingWithNumber(number);
    } else |_| {
        // 你也可以在这里做点额外的事情
    }
}
```

:::

### errdefer

### 合并和推断错误

## 堆栈跟踪