import React from 'react';
import { useFetchJobOffersQuery } from '../../features/jobOffering/infrastructure/jobOfferApi';
import { useJobOfferingListViewModel } from '../../features/jobOffering/application/useJobOfferingListViewModel';

const JobOfferingList = () => {
    const { data, error, isLoading } = useFetchJobOffersQuery({});
    const { jobOfferings } = useJobOfferingListViewModel()

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div>
            {data.map((jobOffer) => (
                <div key={jobOffer.id}>{jobOffer.title}</div>
            ))}
        </div>
    );
};

export default JobOfferingList;
