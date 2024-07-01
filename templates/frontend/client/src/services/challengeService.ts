import { ChallengeDto, CreateChallengeDto } from "../types";

const getSortedChallenges = (player) =>
  player.challenges.sort((a, b) => a.status.localeCompare(b.status));

// Mixin pour vérifier un challenge en cours contre moi
const getChallengeFor = (userName: string) => (challenges: ChallengeDto[]) =>
  challenges.filter((challenge) => challenge.opponent === userName);

const getChallengeSentByMe = (me: string) => (challenges: ChallengeDto[]) =>
  challenges.filter((challenge) => challenge.challenger === me);

const getChallengeByStatus =
  (status: ChallengeDto["status"]) => (challenges: ChallengeDto[]) =>
    challenges.filter((challenge) => challenge.status === status);

const createAnsweredChallenge = (
  challenge: ChallengeDto
): CreateChallengeDto => {
  return {
    id: challenge.id,
    challenger: challenge.challenger,
    opponent: challenge.opponent,
    cards: [],
    sequence: [],
  };
};

const isAnsweredChallenge = (
  challenge: ChallengeDto | CreateChallengeDto
): boolean => challenge.id != null;

const createNewChallenge = (
  me: string,
  opponent: string
): CreateChallengeDto => {
  return {
    id: null,
    challenger: me,
    opponent: opponent,
    cards: [],
    sequence: [],
  };
};

export {
  getSortedChallenges,
  getChallengeSentByMe,
  getChallengeFor,
  getChallengeByStatus,
  createNewChallenge,
  createAnsweredChallenge,
  isAnsweredChallenge,
};
