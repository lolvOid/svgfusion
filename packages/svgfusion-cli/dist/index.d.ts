import { Framework } from 'svgfusion-core';

interface CliOptions {
    framework: Framework;
    input: string;
    output?: string;
    name?: string;
    prefix?: string;
    suffix?: string;
    optimize?: boolean;
    typescript?: boolean;
    javascript?: boolean;
    format?: 'esm' | 'cjs';
    recursive?: boolean;
    verbose?: boolean;
    generateIndex?: boolean;
    indexFormat?: 'ts' | 'js';
    exportType?: 'named' | 'default';
    splitColors?: boolean;
    splitStrokeWidths?: boolean;
    fixedStrokeWidth?: boolean;
    normalizeFillStroke?: boolean;
    accessibility?: boolean;
    removeComments?: boolean;
    removeDuplicates?: boolean;
    forwardRef?: boolean;
    memo?: boolean;
    minifyPaths?: boolean;
    index: boolean;
    isFixedStrokeWidth?: boolean;
}
declare function runCli(): void;

export { type CliOptions, runCli as default, runCli };
