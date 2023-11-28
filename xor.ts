import * as cpu from "./cpu/overture";

cpu.mov(cpu.Reg.Lhs, cpu.Reg.IO);
cpu.mov(cpu.Reg.Rhs, cpu.Reg.IO);

cpu.nand(cpu.Reg.Lhs, cpu.Reg.Rhs, cpu.Reg.T0);
cpu.or(cpu.Reg.Lhs, cpu.Reg.Rhs, cpu.Reg.T1);
cpu.and(cpu.Reg.T0, cpu.Reg.T1, cpu.Reg.IO);

cpu.end();
