import { useFetchJobOffersQuery } from '../../features/jobOffering/infrastructure/jobOfferApi';

const JobOfferingList = () => {
    const { data, error, isLoading } = useFetchJobOffersQuery({});

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {data.map((jobOffer) => (
                <div key={jobOffer.id}>{jobOffer.title}</div>
            ))}
        </div>
    );
};

export default JobOfferingList;
