import * as cpu from "./cpu/overture";

cpu.load(cpu.Reg.Rhs, 3);

const LOOP = cpu.label();
cpu.and(cpu.Reg.IO, undefined, cpu.Reg.IO);
cpu.jmp(LOOP);
cpu.end();
