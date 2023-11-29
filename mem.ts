import * as cpu from "./cpu/leg";

// for (n = 0; n != 32; n++)
{
	const N = cpu.Reg.R1;
	cpu.mov(N, 0);
	const loader = cpu.label();
	{
		// [N] := [IO]
		cpu.mov(cpu.Reg.R0, cpu.Reg.IO);
		cpu.str(N, cpu.Reg.R0);
	}
	cpu.add(N, 1, N);
	cpu.jne(N, 33, loader);
}

// for (n = 0; n != 32; n++)
{
	const N = cpu.Reg.R1;
	cpu.mov(N, 0);
	const storer = cpu.label();
	{
		// [IO] := [N]
		cpu.ldd(N, cpu.Reg.R0);
		cpu.mov(cpu.Reg.IO, cpu.Reg.R0);
	}
	cpu.add(N, 1, N);
	cpu.jne(N, 33, storer);
}

cpu.end();
