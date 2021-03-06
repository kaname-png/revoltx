import { AliasPiece } from '@sapphire/pieces';
import type { Awaitable } from '@sapphire/utilities';

import { Args } from '../parsers/args';
import type { ArgumentContext, ArgumentOptions } from '../../utils/interfaces/argument';
import type { ArgumentError } from '../errors/argument-error';
import type { UserError } from '../errors/user-error';
import type { Result } from '../parsers/result';

/**
 * Defines a synchronous result of an {@link Argument}, check {@link Argument.AsyncResult} for the asynchronous version.
 */
export type ArgumentResult<T> = Awaitable<Result<T, UserError>>;

/**
 * Defines an asynchronous result of an {@link Argument}, check {@link ArgumentResult} for the synchronous version.
 */
export type AsyncArgumentResult<T> = Promise<Result<T, UserError>>;

export interface IArgument<T> {
	/**
	 * The name of the argument, this is used to make the identification of an argument easier.
	 */
	readonly name: string;

	/**
	 * The method which is called when invoking the argument.
	 * @param parameter The string parameter to parse.
	 * @param context The context for the method call, contains the message, command, and other options.
	 */
	run(parameter: string, context: ArgumentContext<T>): ArgumentResult<T>;
}

/**
 * The base argument class. This class is abstract and is to be extended by subclasses implementing the methods. In
 * Sapphire's workflow, arguments are called when using {@link Args}'s methods (usually used inside {@link Command}s by default).
 *
 * @example
 * ```typescript
 * // TypeScript:
 * import { Argument, PieceContext } from '@sapphire/framework';
 * import { URL } from 'url';
 *
 * // Define a class extending `Argument`, then export it.
 * // NOTE: You can use `export default` or `export =` too.
 * export class CoreArgument extends Argument<URL> {
 *   public constructor(context: PieceContext) {
 *     super(context, { name: 'hyperlink', aliases: ['url'] });
 *   }
 *
 *   public run(argument: string): ArgumentResult<URL> {
 *     try {
 *       return this.ok(new URL(argument));
 *     } catch {
 *       return this.error(argument, 'ArgumentHyperlinkInvalidURL', 'The argument did not resolve to a valid URL.');
 *     }
 *   }
 * }
 *
 * // Augment the ArgType structure so `args.pick('url')`, `args.repeat('url')`
 * // and others have a return type of `URL`.
 * declare module '@sapphire/framework' {
 *   export interface ArgType {
 *     url: URL;
 *   }
 * }
 * ```
 *
 * @example
 * ```javascript
 * // JavaScript:
 * const { Argument } = require('@sapphire/framework');
 *
 * // Define a class extending `Argument`, then export it.
 * module.exports = class CoreArgument extends Argument {
 *   constructor(context) {
 *     super(context, { name: 'hyperlink', aliases: ['url'] });
 *   }
 *
 *   run(argument) {
 *     try {
 *       return this.ok(new URL(argument));
 *     } catch {
 *       return this.error(argument, 'ArgumentHyperlinkInvalidURL', 'The argument did not resolve to a valid URL.');
 *     }
 *   }
 * }
 * ```
 */
export abstract class Argument<T = unknown, O extends ArgumentOptions = ArgumentOptions> extends AliasPiece<O> implements IArgument<T> {
	public abstract run(parameter: string, context: ArgumentContext<T>): ArgumentResult<T>;

	/**
	 * Wraps a value into a successful value.
	 * @param value The value to wrap.
	 */
	public ok(value: T): ArgumentResult<T> {
		return Args.ok(value);
	}

	/**
	 * Constructs an {@link ArgumentError} with a custom type.
	 * @param options ArgumentError options
	 */
	public error(options: Omit<ArgumentError.Options<T>, 'argument'>): ArgumentResult<T> {
		return Args.error({ argument: this, identifier: this.name, ...options });
	}
}
