/**
 * A generic handler for time intervals.
 *
 * TODO: This is duplicate of `@swampfox-utils/interval`. Done because the e2e couldn't import the lib.
 * Thus, if ever resolved this can be removed.
 *
 * @export
 * @class Interval
 */
export class Interval {
  // Private fields
  #hours: number;
  #minutes: number;
  #seconds: number;

  // region Static Manipulators
  static fromString(value: string): Interval {
    const splits = value.split(':');
    if (splits.length !== 3) {
      throw new Error(`Value '${value}' does not have the full 'hh:mm:ss' format required for an interval`);
    }
    const [h, m, s] = splits.map(v => +v);
    return new Interval(h, m, s);
  }

  static fromSeconds(seconds: number): Interval {
    const hr = Math.floor(seconds / 3600);
    const sec = seconds % 60;
    const min = Math.floor((seconds - hr * 3600) / 60);
    return new Interval(hr, min, sec);
  }

  /**
   * Convert a decimal part of a day (eg .625) to an interval (eg 15:00:00)
   *
   * @param {number} percentOfDay Decimal part of the day as a time
   * @return {Interval}
   */
  static fromPercentOfDay(percentOfDay: number): Interval {
    const hoursPercent = percentOfDay * 24;
    let hr = Math.floor(hoursPercent);
    const minPercent = (hoursPercent - hr) * 60;
    let min = Math.floor(minPercent);
    const secPercent = (minPercent - min) * 60;
    let sec = Math.round(secPercent);
    if (sec >= 60) {
      sec -= 60;
      min += 1;
    }
    if (min >= 60) {
      min -= 60;
      hr += 1;
    }
    return new Interval(hr, min, sec);
  }

  static add(one: Interval, two: Interval): Interval {
    return Interval.fromSeconds(one.asSeconds + two.asSeconds);
  }

  static subtract(one: Interval, two: Interval): Interval {
    return Interval.fromSeconds(one.asSeconds - two.asSeconds);
  }

  static setSeconds(interval: Interval, value: number): Interval {
    if (value > 59 || value < 0) {
      throw new Error(`Seconds (${value}) out of bounds [0,59]`);
    }
    return new Interval(interval.hours, interval.minutes, value);
  }

  static setMinutes(interval: Interval, value: number): Interval {
    if (value > 59 || value < 0) {
      throw new Error(`Minute (${value}) out of bounds [0,59]`);
    }
    return new Interval(interval.hours, value, interval.seconds);
  }

  static setHours(interval: Interval, value: number): Interval {
    if (value < 0) {
      throw new Error(`Hours (${value}) out of bounds [0,Infinity)`);
    }
    return new Interval(value, interval.minutes, interval.seconds);
  }

  // endregion

  // region Static Equality
  static isGreaterThan(one: Interval, two: Interval): boolean {
    return one.asSeconds > two.asSeconds;
  }

  static isGreaterThanOrEqual(one: Interval, two: Interval): boolean {
    return one.asSeconds >= two.asSeconds;
  }

  static isEqual(one: Interval, two: Interval): boolean {
    return one.#hours === two.#hours && one.#minutes === two.#minutes && one.#seconds === two.#seconds;
  }

  static isLessThan(one: Interval, two: Interval): boolean {
    return one.asSeconds < two.asSeconds;
  }

  static isLessThanOrEqual(one: Interval, two: Interval): boolean {
    return one.asSeconds <= two.asSeconds;
  }

  // endregion

  // region Getters
  get hours(): number {
    return this.#hours;
  }
  get hoursPad12Hr(): string {
    return (this.#hours > 12 ? this.#hours - 12 : this.#hours).toString().padStart(2, '0');
  }

  get minutes(): number {
    return this.#minutes;
  }
  get minutesPad(): string {
    return this.#minutes.toString().padStart(2, '0');
  }

  get seconds(): number {
    return this.#seconds;
  }
  get secondsPad(): string {
    return this.#seconds.toString().padStart(2, '0');
  }

  // endregion

  // region Manipulating Getters
  /**
   * Get the total minutes of this interval.
   * Drops any second component in its calculation
   */
  get asMinutes(): number {
    return this.#hours * 60 + this.#minutes;
  }

  /**
   * Get the total seconds of this interval
   */
  get asSeconds(): number {
    return this.asMinutes * 60 + this.#seconds;
  }

  get meridian(): 'PM' | 'AM' {
    return this.#hours > 12 ? 'PM' : 'AM';
  }

  // endregion

  public toString(): string {
    const hh = this.#hours.toString().padStart(2, '0');
    const mm = this.#minutes.toString().padStart(2, '0');
    const ss = this.#seconds.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  /**
   * Return a new `Interval` with the sum of this interval and another
   *
   * @param other `Interval` to add
   */
  public add(other: Interval): Interval {
    return Interval.add(this, other);
  }

  /**
   * Return a new `Interval` with the difference of this another interval from this one
   *
   * @param other `Interval` to subtract
   */
  public subtract(other: Interval): Interval {
    return Interval.subtract(this, other);
  }

  constructor(hours: number, minutes: number, seconds: number) {
    this.#hours = hours;
    this.#minutes = minutes;
    this.#seconds = seconds;
    if (hours < 0) {
      throw new Error(`Hours (${hours}) out of bounds [0,Infinity)`);
    }
    if (minutes > 59 || minutes < 0) {
      throw new Error(`Minutes (${minutes}) out of bounds [0,59]`);
    }
    if (seconds > 59 || seconds < 0) {
      throw new Error(`Seconds (${seconds}) out of bounds [0,59]`);
    }
  }
}
