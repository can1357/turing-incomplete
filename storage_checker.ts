import * as cpu from "./cpu/overture";

const EST = cpu.Reg.T0;

const LOOP = cpu.label();
cpu.mov(cpu.Reg.IO, EST);
cpu.add(EST, +1, EST);
cpu.jmp(LOOP);
cpu.end();
