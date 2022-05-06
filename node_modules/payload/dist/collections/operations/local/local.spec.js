"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const __1 = __importDefault(require("../../.."));
let createdMediaID;
__1.default.init({
    secret: 'SECRET_KEY',
    mongoURL: 'mongodb://localhost/payload',
    local: true,
});
describe('Collections - Local', () => {
    describe('Create', () => {
        it('should allow an upload-enabled file to be created and uploaded', async () => {
            const alt = 'Alt Text Here';
            const filePath = path_1.default.resolve(__dirname, '../../../admin/assets/images/generic-block-image.svg');
            const { size } = fs_1.default.statSync(filePath);
            const result = await __1.default.create({
                collection: 'media',
                data: {
                    alt,
                },
                filePath,
            });
            expect(result.id).toBeDefined();
            expect(result.alt).toStrictEqual(alt);
            expect(result.filename).toStrictEqual('generic-block-image.svg');
            expect(result.filesize).toStrictEqual(size);
            createdMediaID = result.id;
        });
    });
    describe('Update', () => {
        it('should allow an upload-enabled file to be re-uploaded and alt-text to be changed.', async () => {
            const newAltText = 'New Alt Text Here';
            const result = await __1.default.update({
                collection: 'media',
                id: createdMediaID,
                data: {
                    alt: newAltText,
                },
                filePath: path_1.default.resolve(__dirname, '../../../admin/assets/images/og-image.png'),
            });
            expect(result.alt).toStrictEqual(newAltText);
            expect(result.sizes.mobile.width).toStrictEqual(320);
            expect(result.width).toStrictEqual(640);
        });
    });
    describe('Read with Hidden Fields', () => {
        it('should allow a document with nested hidden fields to be retrieved with hidden fields shown.', async () => {
            const demoHiddenField = 'this is going to be hidden';
            const result = await __1.default.create({
                collection: 'localized-posts',
                data: {
                    title: 'this post has a hidden field present',
                    description: 'desc',
                    priority: 1,
                    nonLocalizedGroup: {
                        text: '40w5g534gw34j',
                    },
                    localizedGroup: {
                        text: '34lijgw45ligjw4li5j',
                        demoHiddenField,
                    },
                },
            });
            expect(result.id).toBeDefined();
            expect(result.localizedGroup).toBeDefined();
            expect(result.localizedGroup.demoHiddenField).toBeUndefined();
            const withHiddenFields = await __1.default.findByID({
                collection: 'localized-posts',
                id: result.id,
                showHiddenFields: true,
            });
            expect(withHiddenFields.localizedGroup.demoHiddenField).toStrictEqual(demoHiddenField);
            expect(withHiddenFields.id).toStrictEqual(result.id);
        });
        it('should allow a document with a relationship to a document with hidden fields to read the related document hidden fields', async () => {
            const demoHiddenField = 'this is going to be hidden';
            const relationshipA = await __1.default.create({
                collection: 'relationship-a',
                data: {
                    demoHiddenField,
                },
            });
            expect(relationshipA.id).toBeDefined();
            expect(relationshipA.demoHiddenField).toBeUndefined();
            const relationshipB = await __1.default.create({
                collection: 'relationship-b',
                data: {
                    title: 'pretty clever name here',
                    post: [relationshipA.id],
                },
            });
            expect(relationshipB.id).toBeDefined();
            const relationshipBWithHiddenNestedField = await __1.default.findByID({
                collection: 'relationship-b',
                id: relationshipB.id,
                showHiddenFields: true,
            });
            expect(relationshipBWithHiddenNestedField.post[0].demoHiddenField).toStrictEqual(demoHiddenField);
        });
        describe('Find', () => {
            const title = 'local-find';
            beforeAll(async (done) => {
                const data = {
                    title,
                    description: 'a description',
                    priority: 1,
                    nonLocalizedGroup: {
                        text: 'english',
                    },
                    localizedGroup: {
                        text: 'english',
                    },
                    nonLocalizedArray: [
                        {
                            localizedEmbeddedText: 'english',
                        },
                    ],
                    richTextBlocks: [
                        {
                            blockType: 'richTextBlock',
                            blockName: 'Test Block Name',
                            content: [
                                {
                                    children: [{ text: 'english' }],
                                },
                            ],
                        },
                    ],
                };
                await __1.default.create({
                    collection: 'localized-posts',
                    data,
                });
                Array.from(Array(10).keys()).map(async (i) => {
                    const uniqueTitle = `${title}-${i}`;
                    await __1.default.create({
                        collection: 'localized-posts',
                        data: {
                            ...data,
                            title: uniqueTitle,
                        },
                    });
                });
                done();
            });
            it('should find collection with query', async () => {
                const result = await __1.default.find({
                    collection: 'localized-posts',
                    where: {
                        title: {
                            equals: title,
                        },
                    },
                });
                const doc = result.docs[0];
                expect(doc.id).toBeDefined();
                expect(doc.title).toStrictEqual(title);
            });
            it('should allow disable pagination to return all docs', async () => {
                const result = await __1.default.find({
                    collection: 'localized-posts',
                    pagination: false,
                    limit: 5, // limit will not be used
                });
                expect(result.docs.length).toBeGreaterThan(10);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb2xsZWN0aW9ucy9vcGVyYXRpb25zL2xvY2FsL2xvY2FsLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLGlEQUErQjtBQUUvQixJQUFJLGNBQWMsQ0FBQztBQUVuQixXQUFPLENBQUMsSUFBSSxDQUFDO0lBQ1gsTUFBTSxFQUFFLFlBQVk7SUFDcEIsUUFBUSxFQUFFLDZCQUE2QjtJQUN2QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDdEIsRUFBRSxDQUFDLGdFQUFnRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzlFLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQztZQUM1QixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUMzQixTQUFTLEVBQ1Qsc0RBQXNELENBQ3ZELENBQUM7WUFDRixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsWUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV2QyxNQUFNLE1BQU0sR0FBVSxNQUFNLFdBQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ3pDLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixJQUFJLEVBQUU7b0JBQ0osR0FBRztpQkFDSjtnQkFDRCxRQUFRO2FBQ1QsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyx5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