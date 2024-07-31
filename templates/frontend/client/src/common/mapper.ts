export type MapperFunction<Source, Target> = (source: Source) => Target;

export function createMapper<Source, Target>(
  mappingFn: MapperFunction<Source, Target>
): MapperFunction<Source, Target> {
  return (source: Source): Target => {
    return mappingFn(source);
  };
}
