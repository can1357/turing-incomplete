import * as cpu from "./cpu/overture";
import createRobot from "./io/robot";
const robot = createRobot(cpu);

{
	const L0 = cpu.label();
	robot.forward();
	robot.left();

	robot.read(cpu.Reg.Out);
	cpu.jmp(L0, cpu.CC.Z);

	const L1 = cpu.label();
	robot.right();
	robot.act();
	robot.read(cpu.Reg.Out);
	cpu.jmp(L1, cpu.CC.NZ);
	cpu.jmp(L0);
}

cpu.end();
