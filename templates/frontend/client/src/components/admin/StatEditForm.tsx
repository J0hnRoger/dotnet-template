import { FC } from "react";
import { StatDto } from "../../types";
import { Input } from "@components/ui/input";

export interface StatEditFormProps {
    stat: StatDto;
    onStatChange: (stat: StatDto) => void;
} 

export const StatEditForm: FC<StatEditFormProps> = ({ stat, onStatChange }) => {
    return (
        <div>
              <label>{stat.name}</label>
              <div className="flex">
                <div>
                    <Input type="number"
                            value={stat.value}
                            onChange={(e) => {
                                onStatChange({ ...stat, value: parseInt(e.target.value) });
                            }}
                        />
                </div>
              </div>
        </div>
    )
}