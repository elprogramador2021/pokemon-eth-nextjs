import { Accordion, Card, Avatar } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";

import { useEffect, useState } from "react";

const DEFAULT_POKEMON = "https://thegamehaus.com/wp-content/uploads/2022/03/de357461f3a370e586e7dd1e20ec4af46b268a47_hq.jpg";

export default function Body() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const pokemonFactoryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [myPokemons, setMyPokemons] = useState([]);
    const [pokemons, sePokemons] = useState([]);

    const { runContractFunction: getMyPokemons } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "getMyPokemons",
        params: {},
    });

    const { runContractFunction: getAllPokemons } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "getAllPokemons",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            geAllGeneralPokemons();
            getAllMyPokemons();
        }
    }, [isWeb3Enabled]);

    const getAllMyPokemons = async () => {
        const pokemones = await getMyPokemons();
        setMyPokemons(pokemones);
    };

    const geAllGeneralPokemons = async () => {
        const pokemones = await getAllPokemons();
        console.log("XD", pokemones);
        sePokemons(pokemones);
    };

    return (
        <div className="bg-slate-400 w-full">
            <Accordion id="accordion" title="All Pokemons" isExpanded className="overflow-y-auto my-2">
                <div className="flex flex-wrap place-content-center ">
                    {pokemons?.map((p) => (
                        <div
                            key={parseInt(p["0"])}
                            className="p-2"
                            style={{
                                width: "250px",
                            }}
                        >
                            <Card
                                description={p["3"].toString()}
                                title={p["1"]}
                                tooltipText={
                                    <div>
                                        <div style={{ width: 200, paddingBottom: 10 }}>Types: {p.types}</div>
                                        <div style={{ width: 200, paddingBottom: 10 }}>Weaknesses: {p.weaknesses.toString()}</div>
                                    </div>
                                }
                            >
                                <div className="flex place-content-center">
                                    <Avatar image={p["2"]} isRounded size={180} theme="image" />
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </Accordion>
            <Accordion id="accordion" title="My Pokemons" isExpanded className="overflow-y-auto my-2">
                <div className="flex flex-wrap place-content-center ">
                    {myPokemons?.map((p) => (
                        <div
                            key={parseInt(p["0"])}
                            className="p-2"
                            style={{
                                width: "250px",
                            }}
                        >
                            <Card
                                description={p["3"].toString()}
                                title={p["1"]}
                                tooltipText={
                                    <div>
                                        <div style={{ width: 200, paddingBottom: 10 }}>Types: {p.types}</div>
                                        <div style={{ width: 200, paddingBottom: 10 }}>Weaknesses: {p.weaknesses.toString()}</div>
                                    </div>
                                }
                            >
                                <div className="flex place-content-center">
                                    <Avatar image={p["2"]} isRounded size={180} theme="image" />
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </Accordion>
        </div>
    );
}
