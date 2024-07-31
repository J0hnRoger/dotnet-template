// application/services/JobOfferMapper.ts
import { JobOffer } from "./JobOffer";
import { JobOfferDto } from "../application/types/jobOfferTypes";
import { createMapper, MapperFunction } from "@common/mapper";

const toEntity: MapperFunction<JobOfferDto, JobOffer> = (dto) => ({
  id: dto.id,
  title: dto.jobTitle,
  description: dto.jobDescription,
});

const toDTO: MapperFunction<JobOffer, JobOfferDto> = (entity) => ({
  id: entity.id,
  jobTitle: entity.title,
  jobDescription: entity.description,
});

export const mapToEntity = createMapper(toEntity);
export const mapToDTO = createMapper(toDTO);
