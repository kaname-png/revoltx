import type { AliasPieceOptions } from '@sapphire/pieces';
import type { Maybe } from '@sapphire/result';
import type { Message, Member, User, Channel } from 'revolt.js';

import type { Args } from '../../lib/parsers/args';
import type { IArgument } from '../../lib/structures/argument';
import type { Command } from '../../lib/structures/command';
import type { DirectMessageChannel, GroupChannel, SavedMessagesChannel, TextChannel, VoiceChannel } from './channel';

export interface ArgumentOptions extends AliasPieceOptions {}

export interface ArgumentContext<T = unknown> extends Record<PropertyKey, unknown> {
	argument: IArgument<T>;
	args: Args;
	message: Message;
	command: Command;
	minimum?: number;
	maximum?: number;
	inclusive?: boolean;
}

export interface ArgType {
	boolean: boolean;
	channel: Channel;
	dmChannel: DirectMessageChannel;
	groupChannel: GroupChannel;
	guildChannel: Channel;
	guildTextChannel: TextChannel;
	guildVoiceChannel: VoiceChannel;
	enum: string;
	float: number;
	hyperlink: URL;
	integer: number;
	message: Message;
	member: Member;
	number: number;
	savedMessagesChannel: SavedMessagesChannel;
	string: string;
	user: User;
}

export interface ArgOptions extends Omit<ArgumentContext, 'message' | 'command'> {}

export interface RepeatArgOptions extends ArgOptions {
	/**
	 * The maximum amount of times the argument can be repeated.
	 * @default Infinity
	 */
	times?: number;
}

/**
 * The callback used for {@link Args.nextMaybe} and {@link Args.next}.
 */
export interface ArgsNextCallback<T> {
	/**
	 * The value to be mapped.
	 */
	(value: string): Maybe<T>;
}
