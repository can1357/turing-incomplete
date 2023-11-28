import type * as Overture from "../cpu/overture";
export default function (cpu: typeof Overture) {
	return {
		left: () => cpu.mov(cpu.Reg.IO, 0),
		forward: () => cpu.mov(cpu.Reg.IO, 1),
		right: () => cpu.mov(cpu.Reg.IO, 2),
		noop: () => cpu.mov(cpu.Reg.IO, 3),
		act: () => cpu.mov(cpu.Reg.IO, 4),
		laser: () => cpu.mov(cpu.Reg.IO, 5),
		read: (dst: Overture.Reg) => cpu.mov(dst, cpu.Reg.IO),
	};
}
