import { readFileSync } from 'fs';

export class DevGenerator {
  private readonly interfaceFiles: string[];
  private readonly interfaceFilesContents: string[] = [];
  private readonly typesRegEpx = new RegExp('[a-zA-Z]+<T[^>]*>', 'g');
  private readonly interfaceRegEpx = new RegExp(
    '(export\\s+interface\\s+([^\\s]+)\\s+{.*\\})\\s+\\{[^}]+[^;]',
    'gm',
  );
  private readonly fieldTypeName = 'EsFieldType<T>';
  private readonly fieldTypeNames = 'EsFieldTypes<T>';
  private readonly scalars = {
    string: 'string',
    stringArray: 'string[]',
    number: 'number',
    numberArray: 'number[]',
    boolean: 'boolean',
  };

  public constructor(interfaceFiles: string | string[]) {
    this.interfaceFiles =
      typeof interfaceFiles === 'string' ? [interfaceFiles] : interfaceFiles;
  }

  private loadFiles() {
    this.interfaceFiles.forEach((file) => {
      this.interfaceFilesContents.push(readFileSync(file).toString('utf-8'));
    });
  }

  public processMapping() {
    this.loadFiles();
    const types: string[] = [];
    const definitions: string[] = [];
    for (const fileContent of this.interfaceFilesContents) {
      types.push(...fileContent.match(this.typesRegEpx));
      const definitions = fileContent.match(this.interfaceRegEpx);
      console.log(123);
    }
    console.log(123);
  }

  private static makePlaceHolderName() {}
}
