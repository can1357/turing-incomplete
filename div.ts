import * as cpu from "./cpu/leg";

// Read numerator.
//
cpu.mov(cpu.Reg.R0, cpu.Reg.IO);

// Read denominator.
//
cpu.mov(cpu.Reg.R1, cpu.Reg.IO);

// Divide.
//
{
	const diver = cpu.label();
	cpu.jl(cpu.Reg.R0, cpu.Reg.R1, diver + 4 * 4);
	cpu.add(cpu.Reg.R2, 1, cpu.Reg.R2);
	cpu.sub(cpu.Reg.R0, cpu.Reg.R1, cpu.Reg.R0);
	cpu.jmp(diver);
}

// Output after adjustments.
//
cpu.mov(cpu.Reg.IO, cpu.Reg.R2);
cpu.mov(cpu.Reg.IO, cpu.Reg.R0);

//cpu.end();

const output = new Uint16Array(0x100 * 0x100);
const res = new Uint8Array(output.buffer, output.byteOffset, 0x100 * 0x100 * 2);

for (let a = 0x00; a <= 0xff; a++) {
	const idx = 0x200 * a;
	for (let b = 0x1; b <= 0xff; b++) {
		const rem = a % b;
		const quo = (a - rem) / b;
		res[idx + b * 2 + 0] = rem;
		res[idx + b * 2 + 1] = quo;
	}
}
{
	const a = 0xa;
	const b = 0x3;
	const idx = 0x100 * a;
	const rem = a % b;
	const quo = (a - rem) / b;
	console.log(rem, quo);
	console.log(idx + b * 2);
}
console.log(res[0xa03 * 2]);
console.log(res[0xa03 * 2 + 1]);
import * as fs from "fs";
fs.writeFileSync("test.txt", output.join("\n"));
