import * as cpu from "./cpu/overture";
import createRobot from "./io/robot";
const robot = createRobot(cpu);

// Get in position.
//
for (let n = 0; n != 6; n++) {
	robot.forward();
}
robot.left();

const body = cpu.label();
{
	cpu.comment("--prefire--");
	robot.laser();

	cpu.comment("--wait for alien--");
	// Stall until alien in sight
	{
		const stall = cpu.label();
		robot.noop();
		robot.read(cpu.Reg.Lhs);
		cpu.sub(cpu.Reg.Lhs, 33);
		cpu.jmp(stall, cpu.CC.NZ);
	}

	cpu.comment("--fire n forget--");
	// Shoot until nothing in sight
	{
		const fire = cpu.label();
		robot.laser();
		robot.laser();
		robot.read(cpu.Reg.Out);
		cpu.jmp(fire, cpu.CC.NZ);
	}

	cpu.comment("--rotate--");
	// Rotate
	robot.left();
	robot.left();
	cpu.jmp(body);
}
cpu.end();
