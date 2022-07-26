import { useState } from "react";
import { ConnectButton, Button } from "web3uikit";
import { MdCatchingPokemon } from "react-icons/md";
import { AiOutlineWallet } from "react-icons/ai";
import { BsFillPlusCircleFill } from "react-icons/bs";
import ModalPokemon from "./ModalPokemon";
import ModalType from "./ModalType";
import Image from "next/image";

export default function Header() {
    const [showModal, setShowModal] = useState(0);

    const mostrarModalPokemon = (mostrar) => {
        setShowModal(mostrar);
    };

    const mostrarModalType = (mostrar) => {
        setShowModal(mostrar);
    };
    return (
        <div className="w-full">
            <div className="flex place-content-center items-center">
                <MdCatchingPokemon size={50} />
                <h1 className="font-bold">Pokemon Factory</h1>
            </div>

            <div className="flex place-content-center pb-10 items-center">
                <AiOutlineWallet size={40} />
                <span className="font-light"> Metamask - Rinkeby Network</span>
            </div>

            {showModal == 0 && (
                <div className="flex place-content-around">
                    <ConnectButton moralisAuth={false} />

                    <div className="flex flex-col">
                        <div className="py-1">
                            <Button
                                color="blue"
                                onClick={() => mostrarModalPokemon(1)}
                                size="regular"
                                text={
                                    <span className="flex">
                                        <BsFillPlusCircleFill /> Pokemon
                                    </span>
                                }
                                theme="colored"
                            />
                        </div>

                        <div className="flex py-1">
                            <Button
                                color="blue"
                                onClick={() => mostrarModalType(2)}
                                size="regular"
                                text={
                                    <span className="flex">
                                        <BsFillPlusCircleFill /> Types
                                    </span>
                                }
                                theme="colored"
                            />
                        </div>
                    </div>
                </div>
            )}

            {showModal == 1 && <ModalPokemon mostrarModal={mostrarModalPokemon} />}

            {showModal == 2 && <ModalType mostrarModal={mostrarModalType} />}
        </div>
    );
}
