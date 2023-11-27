const NOT_IMM = 1 << 30;
export enum CC {
	GT = parseInt("111", 2),
	GE = parseInt("110", 2),
	LE = parseInt("011", 2),
	LT = parseInt("010", 2),
	NZ = parseInt("101", 2),
	Z = parseInt("001", 2),
	Always = parseInt("100", 2),
}
export enum Reg {
	IO = NOT_IMM | 6,
	T1 = NOT_IMM | 5, // reg5
	T0 = NOT_IMM | 4, // reg4
	Out = NOT_IMM | 3, // reg3 [op-out & comparion]
	Rhs = NOT_IMM | 2, // reg2 [op1]
	Lhs = NOT_IMM | 1, // reg1 [op0]
	Imm = NOT_IMM | 0, // reg0 [immediate goes here]
}
export enum OP {
	Sub = parseInt("101", 2),
	Add = parseInt("100", 2),
	And = parseInt("011", 2),
	Nor = parseInt("010", 2),
	Nand = parseInt("001", 2),
	Or = parseInt("000", 2),
}

// Result.
//
let result: [null | number, string][] = [];
export function push(v: null | number, comment: string = `${v}`) {
	result.push([v != null ? v & 0xff : null, comment]);
}
export function end() {
	for (const [op, cmt] of result) {
		if (op != null) console.log(`${op} # ${cmt}`);
		else console.log(`# ${cmt}`);
	}
}
export function begin() {
	result.length = 0;
}

// Calculations.
//
export function calc(op: OP, lhs: number | Reg = Reg.Lhs, rhs: number | Reg = Reg.Rhs, out: Reg = Reg.Out) {
	mov(Reg.Lhs, lhs);
	mov(Reg.Rhs, rhs);
	push(64 | op, `calc()`);
	mov(out, Reg.Out);
}
export function makeCalc(op: OP) {
	return (lhs: number | Reg = Reg.Lhs, rhs: number | Reg = Reg.Rhs, out: Reg = Reg.Out) => {
		return calc(op, lhs, rhs, out);
	};
}
export const add = makeCalc(OP.Add);
export const and = makeCalc(OP.And);
export const sub = makeCalc(OP.Sub);
export const nor = makeCalc(OP.Nor);
export const nand = makeCalc(OP.Nand);
export const or = makeCalc(OP.Or);

// Noop & comments.
//
export function noop(comment: string) {
	push(128, comment);
}
export function comment(comment: string) {
	push(null, comment);
}

// Loading constants.
//
const MAX_INLINE = 63;
export function load(into: Reg, value: number) {
	value &= 0xff;

	// If we need to do multiple steps:
	//
	if (value > MAX_INLINE) {
		load(Reg.Lhs, value - MAX_INLINE);
		load(Reg.Rhs, MAX_INLINE);
		return add(Reg.Lhs, Reg.Rhs, into);
	}

	// If we have to explicitly mov:
	//
	if (into != Reg.Imm) {
		load(Reg.Imm, value);
		return mov(into, Reg.Imm);
	}

	// Ez.
	return push(value, `load(${Reg[into]}, ${value})`);
}

// Copy.
//
export function mov(dst: Reg, src: number | Reg) {
	if (dst != src) {
		if (src < NOT_IMM) {
			return load(dst, src);
		}

		push(128 | dst | (src * 8), `mov(${Reg[dst]}, ${Reg[src]})`);
	}
}

// Control flow.
//
export function label() {
	return result.reduce((prev, cur) => prev + (cur[0] != null ? 1 : 0), 0);
}
export function jmp(label: number, cc: CC = CC.Always) {
	load(Reg.Imm, label);
	push(192 | cc, `jmp(${CC[cc]})`);
}
