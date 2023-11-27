import * as cpu from "./overture";

const left = () => cpu.mov(cpu.Reg.IO, 0);
const forward = () => cpu.mov(cpu.Reg.IO, 1);
const right = () => cpu.mov(cpu.Reg.IO, 2);
const noop = () => cpu.mov(cpu.Reg.IO, 3);
const act = () => cpu.mov(cpu.Reg.IO, 4);
const laser = () => cpu.mov(cpu.Reg.IO, 5);
const read = (dst: cpu.Reg = cpu.Reg.IO) => cpu.mov(dst, cpu.Reg.IO);

// Get in position.
//
for (let n = 0; n != 6; n++) {
	forward();
}
left();

const body = cpu.label();
{
	cpu.comment("--prefire--");
	laser();

	cpu.comment("--wait for alien--");
	// Stall until alien in sight
	{
		const stall = cpu.label();
		noop();
		read(cpu.Reg.Lhs);
		cpu.sub(cpu.Reg.Lhs, 33);
		cpu.jmp(stall, cpu.CC.NZ);
	}

	cpu.comment("--fire n forget--");
	// Shoot until nothing in sight
	{
		const fire = cpu.label();
		laser();
		laser();
		read(cpu.Reg.Out);
		cpu.jmp(fire, cpu.CC.NZ);
	}

	cpu.comment("--rotate--");
	// Rotate
	left();
	left();
	cpu.jmp(body);
}
cpu.end();
