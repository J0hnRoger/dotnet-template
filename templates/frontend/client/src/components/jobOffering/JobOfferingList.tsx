import { useJobOfferingListViewModel } from '../../features/jobOffering/application/useJobOfferingListViewModel';

const JobOfferingList = () => {
    const { jobOfferings, loading, error } = useJobOfferingListViewModel()

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div>
            {jobOfferings.map((jobOffer) => (
                <div key={jobOffer.id}>{jobOffer.title}</div>
            ))}
        </div>
    );
};

export default JobOfferingList;
