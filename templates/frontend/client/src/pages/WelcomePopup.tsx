import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog"

import useLocalStorage from "../hooks/useLocalStorage"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "@components/Button"

export const WelcomePopup = () => {
    const [isOpen, setOpen] = useLocalStorage<boolean>("welcome-popup", true)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="p-8">
                <DialogHeader>
                    <DialogTitle>La vie de maître de guilde est probablement plus ennuyeuse que vous le pensiez...</DialogTitle>
                    <DialogDescription className="py-4 flex flex-col space-y-4">
                        <div className="my-4">
                            Bienvenue dans votre nouvelle guilde! Pas de combats directs pour vous, tout se gère depuis le fauteuil de votre bureau...
                            Je vous laisse prendre en main votre poste de travail.
                        </div>

                        <div className="font-bold">Bonne chance!</div>
                        <div>
                            <DialogClose>
                                <Button onClick={handleClose}>C'est compris</Button>
                            </DialogClose>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}