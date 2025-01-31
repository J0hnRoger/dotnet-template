// application/services/JobOfferMapper.ts
import { JobOffer } from "./jobOffer";
import { JobOfferDto } from "../application/types/jobOfferTypes";
import { createMapper, MapperFunction } from "@common/mapper";

const toEntity: MapperFunction<JobOfferDto, JobOffer> = (dto) => ({
  id: dto.id,
  title: dto.title,
  description: "",
  enterprise: {},
  duration: 12,
  origin: "",
  status: "open",
  response: "",
  contact: [],
  rythm: "remote"
});

const toDTO: MapperFunction<JobOffer, JobOfferDto> = (entity) => ({
  id: entity.id,
  title: entity.title,
});

export const mapToEntity = createMapper(toEntity);
export const mapToDTO = createMapper(toDTO);
