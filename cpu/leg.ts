export enum Cc {
	EQ = 0x20,
	NE = 0x21,
	LT = 0x22,
	LE = 0x23,
	GT = 0x24,
	GE = 0x25,
	ANY = 0x26,
}
export enum Op {
	ADD = 0,
	SUB = 1,
	AND = 2,
	OR = 3,
	NOT = 4,
	XOR = 5,
	NEG = 6,
	SHR = 7,
	SAR = 8,
	SHL = 9,
	LOAD = 10,
	STORE = 11,
	IMM_B = 0x40,
	IMM_A = 0x80,
}
export enum Reg {
	R0 = "0",
	R1 = "1",
	R2 = "2",
	R3 = "3",
	R4 = "4",
	R5 = "5",
	IP = "6",
	IO = "7",
	NUL = "8",
}

type Code = [string, number, number, number, number];

// Result.
//
let result: Code[] = [];
export function push(cmt: string, b0: number, b1: number, b2: number, b3: number) {
	const data: Code = [cmt, b0, b1, b2, b3];
	result.push(data);
	return data;
}
export function end() {
	for (const [cmt, a, b, c, d] of result) {
		console.log(`# ${cmt}`);
		console.log(`${a}`);
		console.log(`${b}`);
		console.log(`${c}`);
		console.log(`${d}`);
	}
}
export function begin() {
	result.length = 0;
}

// Calculations.
//
export function calc(op: Op, lhs: number | Reg, rhs: number | Reg, out: number | Reg) {
	const cmt = `${Op[op]}[${JSON.stringify({ lhs, rhs, out })}]`;
	if (typeof lhs === "number") {
		op |= Op.IMM_A;
	} else {
		lhs = +lhs;
	}
	if (typeof rhs === "number") {
		op |= Op.IMM_B;
	} else {
		rhs = +rhs;
	}
	return push(cmt, op, lhs, rhs, +out);
}
function makeUn(op: Op) {
	return (lhs: number | Reg, out: Reg) => {
		return calc(op, lhs, 0, out);
	};
}
function makeBin(op: Op) {
	return (lhs: number | Reg, rhs: number | Reg, out: Reg) => {
		return calc(op, lhs, rhs, out);
	};
}

export const add = makeBin(Op.ADD);
export const sub = makeBin(Op.SUB);
export const and = makeBin(Op.AND);
export const or = makeBin(Op.OR);
export const not = makeUn(Op.NOT);
export const xor = makeBin(Op.XOR);
export const neg = makeUn(Op.NEG);
export const shr = makeBin(Op.SHR);
export const sar = makeBin(Op.SAR);
export const shl = makeBin(Op.SHL);

// Noop.
//
export function noop(comment: string) {
	push(comment, Op.OR, 0, 0, 0);
}

// Loading constants.
//
export function load(into: Reg, value: number) {
	value &= 0xff;
	return push(`load(r${into}, ${value})`, Op.OR | Op.IMM_A | Op.IMM_B, value, value, +into);
}

// Copy.
//
export function mov(dst: Reg, src: number | Reg) {
	if (dst != src) {
		if (typeof src !== "string") {
			return load(dst, src);
		} else {
			return push(`mov(r${dst}, r${src})`, Op.OR | Op.IMM_B, +src, 0, +dst);
		}
	}
}

// Memory.
//
export function ldd(adr: number | Reg, dst: Reg) {
	const cmt = `ldd[${JSON.stringify({ adr, dst })}]`;
	let lhs = adr;
	let op = Op.LOAD;
	if (typeof lhs === "number") {
		op |= Op.IMM_A;
	} else {
		lhs = +lhs;
	}
	return push(cmt, op, lhs, +Reg.NUL, +dst);
}
export function str(adr: number | Reg, src: number | Reg) {
	const cmt = `str[${JSON.stringify({ adr, src })}]`;
	let lhs = adr;
	let rhs = src;
	let op = Op.STORE;
	if (typeof lhs === "number") {
		op |= Op.IMM_A;
	} else {
		lhs = +lhs;
	}
	if (typeof rhs === "number") {
		op |= Op.IMM_B;
	} else {
		rhs = +rhs;
	}
	return push(cmt, op, lhs, rhs, +Reg.NUL);
}

// Control flow.
//
export function label() {
	return result.reduce((prev, cur) => prev + (cur[0] != null ? 4 : 0), 0);
}
function makeJcc(cc: Cc) {
	return (lhs: number | Reg, rhs: number | Reg, label: number) => {
		return calc(cc as any as Op, lhs, rhs, label);
	};
}
export const je = makeJcc(Cc.EQ);
export const jne = makeJcc(Cc.NE);
export const jl = makeJcc(Cc.LT);
export const jle = makeJcc(Cc.LE);
export const jg = makeJcc(Cc.GT);
export const jge = makeJcc(Cc.GE);

export function jmp(label: number) {
	return push(`jmp(${label})`, Cc.ANY | Op.IMM_A | Op.IMM_B, 0, 0, label);
}
