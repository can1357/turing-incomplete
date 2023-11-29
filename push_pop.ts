import * as cpu from "./cpu/leg";

{
	const SP = cpu.Reg.R1;
	const CMD = cpu.Reg.R0;
	const dispatch = cpu.label();

	cpu.mov(CMD, cpu.Reg.IO);
	const patch = cpu.jne(CMD, 0, 0);

	// pop
	{
		cpu.sub(SP, 1, SP);
		cpu.ldd(SP, cpu.Reg.IO);
		cpu.jmp(dispatch);
	}
	// push
	{
		patch[4] = cpu.label();
		cpu.str(SP, CMD);
		cpu.add(SP, 1, SP);
		cpu.jmp(dispatch);
	}
}
cpu.end();
