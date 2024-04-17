// unfortunately, the types for citation-js are not available,
// so we need to declare them ourselves.
// The declaration file is not complete! only the used functionalities are implemented

declare module '@citation-js/core' {
  class Cite {
    static async(data: string | import('csl-json').IData[]): Promise<{
      data: import('csl-json').IData[];
      format: (
        format: string,
        type:
          | {
              template: string;
              lang: string;
              append: () => string;
            }
          | Record<string, never>
      ) => string;
    }>;
  }

  export { Cite };
}
