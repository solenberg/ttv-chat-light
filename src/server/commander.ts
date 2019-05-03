import * as config from './config';
import { readCommands } from './file-manager';
import EffectsManager from './effects-manager';

enum CommandType {
  Sound = 'sound',
  Voice = 'voice',
  Scene = 'scene',
  Light = 'light'
}

class Command {
  constructor(
    public name: string,
    public isEnabled: boolean,
    public type: CommandType,
    public options?: any[] | undefined
  ) {}
}

export default class Commander {
  public supportedCommands: Command[] = [];

  constructor(private effectsManager: EffectsManager) {
    this.loadCommands().then(() => {
      this.effectsManager.soundFx.availableSoundEffects.forEach(soundEffect => {
        this.supportedCommands.push(
          new Command(soundEffect.name, true, CommandType.Sound)
        );
      });
    });
  }

  public determineCommandUsed = (message: string): Command | undefined =>
    this.supportedCommands.find((command: Command) =>
      message.includes(command.name)
    );

  private loadCommands = async () => {
    // read commands from effects.json
    // convert each command to Command class
    // determine if command is enabled from config
    const result = await readCommands();
    const commands = JSON.parse(result);
    Object.keys(commands).forEach((commandType: string) => {
      commands[commandType].forEach((commandName: string) => {
        const supportedCommand = new Command(
          commandName,
          true,
          commandType as CommandType
        );
        this.supportedCommands.push(supportedCommand);
      });
    });
  };
}