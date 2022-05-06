import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const random = require('random');
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 10,
    min: 5,
  },
  wordsPerSentence: {
    max: 20,
    min: 6,
  },
});

@EsEntity('huge_test_index_main')
export class HugeTestingClass {
  @EsId()
  public id: string;

  @EsProperty('geo_point')
  public geoPoint: number[];

  @EsProperty('date')
  public createdAt: Date = new Date();

  @EsProperty('date')
  public updatedAt: Date[] = [new Date(), new Date()];

  @EsProperty({ type: 'text' })
  public body: string = lorem.generateParagraphs(5);

  @EsProperty({ type: 'text' })
  public title: string = lorem.generateSentences(1);

  @EsProperty({ type: 'text' })
  public subtitle: string = lorem.generateSentences(1);

  @EsProperty({ type: 'integer' })
  public views: number = random.int(0, 99999);

  @EsProperty({ type: 'integer' })
  public category: number = random.int(0, 99999);

  @EsProperty({ type: 'integer' })
  public categories: number[] = [
    random.int(0, 99999),
    random.int(0, 99999),
    random.int(0, 99999),
  ];

  @EsProperty({ type: 'boolean' })
  public isActive: boolean = random.boolean();

  @EsProperty({ type: 'integer' })
  public section: number = random.int(0, 99999);

  @EsProperty({ type: 'boolean' })
  public fingersCrossedForUkraine: boolean = true;

  @EsProperty({ type: 'integer' })
  public userId: number = random.int(0, 99999);

  @EsProperty({ type: 'integer' })
  public priority: number = random.int(0, 99999);
}
