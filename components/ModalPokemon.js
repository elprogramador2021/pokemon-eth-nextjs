import { Modal, SvgEdit, Typography, Input, Select, Avatar } from "web3uikit";
import { AiFillCheckCircle } from "react-icons/ai";

import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";

import { useNotification } from "web3uikit";

const DEFAULT_POKEMON = "https://thegamehaus.com/wp-content/uploads/2022/03/de357461f3a370e586e7dd1e20ec4af46b268a47_hq.jpg";
const API_POKEMON = "https://pokeapi.co/api/v2/pokemon/";

export default function ModalPokemon({ mostrarModal }) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const pokemonFactoryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [pokemonImg, setPokemonImg] = useState(DEFAULT_POKEMON);
    const [pokemon, setPokemon] = useState({ id: 0, name: "", image: DEFAULT_POKEMON, namesAbility: [], descripsAbility: [], types_name: [] });
    const [types, setTypes] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);

    const [typeTmp, setTypeTmp] = useState("");

    const [isLoadingSuccess, setIsLoadingSucess] = useState(false);

    const dispatch = useNotification();

    const { runContractFunction: getAllTypes } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "getAllTypes",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            buscarPokemonTypes();
        }
    }, [isWeb3Enabled]);

    const buscarPokemonTypes = async () => {
        const allTypes = await getAllTypes();
        const newTypes = [];
        allTypes.map((e, i) => {
            newTypes.push({ id: i, label: e });
        });
        //console.log(newTypes);
        setTypes(newTypes);
    };

    const { runContractFunction: getWeaknessesByType } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "getWeaknessesByType",
        params: { _type: typeTmp },
    });

    //createPokemon
    const {
        runContractFunction: createPokemon,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "createPokemon",
        params: { _id: pokemon.id, _name: pokemon.name, _image: pokemon.image, _namesAbility: pokemon.namesAbility, _descripsAbility: pokemon.descripsAbility, _types_name: pokemon.types_name },
    });

    //GetAll Pokemons
    const { runContractFunction: pokemons } = useWeb3Contract({
        abi: abi,
        contractAddress: pokemonFactoryAddress,
        functionName: "pokemons",
        params: {},
    });

    const seleccionarTPokemonType = async (type) => {
        setPokemon({ ...pokemon, types_name: [...pokemon.types_name, type.label] });
    };

    useEffect(() => {
        buscarWeaknessesByType();
    }, [pokemon.types_name.length]);

    const buscarWeaknessesByType = async () => {
        if (pokemon.types_name.length == 0) {
            setPokemon({ ...pokemon, types_name: [] });
            setWeaknesses([]);
        } else {
            const allWeaknesses = await getWeaknessesByType();
            setWeaknesses([...weaknesses, allWeaknesses]);
            //console.log(allWeaknesses);
        }
    };

    const buscarPokemonImg = async () => {
        await fetch(`${API_POKEMON}${pokemon.name}`)
            .then((response) => response.json())
            .then((response) => {
                //let products = response;
                let newImage = response.sprites.front_default;
                console.log("#", newImage);
                setPokemon({ ...pokemon, image: newImage });
            })
            .catch((error) => {
                setPokemon({ ...pokemon, image: DEFAULT_POKEMON });
            });
    };

    const LimpiarCampos = () => {
        setPokemon({ id: 0, name: "", image: DEFAULT_POKEMON, namesAbility: [], descripsAbility: [], types_name: [] });
        setPokemonImg(DEFAULT_POKEMON);
        setTypes([]);
        setWeaknesses([]);
        setTypeTmp("");
    };

    const handleSuccess = async (tx) => {
        setIsLoadingSucess(true);
        await tx.wait(1);
        hadleNewNotification(tx);

        setIsLoadingSucess(false);
        //Limpiar Campos
        LimpiarCampos();
    };

    const hadleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        });
    };

    return (
        <div
            style={{
                height: "90vh",
                transform: "scale(1)",
            }}
        >
            <div>
                <Modal
                    cancelText="Clean Fields"
                    id="regular"
                    isVisible
                    okText="Guardar"
                    onCancel={LimpiarCampos}
                    onCloseButtonPressed={() => mostrarModal(0)}
                    onOk={async function () {
                        await createPokemon({
                            onSuccess: handleSuccess,
                        });
                    }}
                    title={() => (
                        <div style={{ display: "flex", gap: 10 }}>
                            <SvgEdit fill="#68738D" fontSize={28} />
                            <Typography color="#68738D" variant="h3">
                                Pokemon
                            </Typography>
                        </div>
                    )}
                >
                    {isLoading || isFetching || isLoadingSuccess ? (
                        <div
                            style={{
                                padding: "20px 0 20px 0",
                            }}
                        >
                            <div className="text-center">
                                <div role="status">
                                    <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                </div>
                                <div className="pt-5">{isLoadingSuccess ? <span>Processing Transaction...</span> : <span>Loading...</span>}</div>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                padding: "20px 0 20px 0",
                            }}
                        >
                            <div className="py-5">
                                <Input label="#ID POKEMON" width="100%" type="number" value={pokemon.id} onChange={(e) => setPokemon({ ...pokemon, id: e.target.value })} />
                            </div>
                            <div className="py-5 flex">
                                <div className="flex-1">
                                    <Input label="NAME" width="100%" value={pokemon.name} onChange={(e) => setPokemon({ ...pokemon, name: e.target.value })} />
                                </div>
                                <div>
                                    <span className="flex ml-3" onClick={buscarPokemonImg}>
                                        <AiFillCheckCircle size={40} />
                                    </span>
                                </div>
                            </div>
                            <div className="flex place-content-center">
                                <Avatar image={pokemon.image} isRounded size={150} theme="image" />
                            </div>
                            <div className="py-5">
                                <Input label="ABILITIES NAME" width="100%" description="separated by commas" value={pokemon.namesAbility.toString()} onChange={(e) => setPokemon({ ...pokemon, namesAbility: e.target.value.split(",") })} />
                            </div>

                            <div className="py-5">
                                <Input label="ABILITIES DESCRIPT" width="100%" description="separated by commas" value={pokemon.descripsAbility.toString()} onChange={(e) => setPokemon({ ...pokemon, descripsAbility: e.target.value.split(",") })} />
                            </div>
                            <div className="py-2">
                                <Select
                                    width="100%"
                                    defaultOptionIndex={0}
                                    onBlurTraditional={function noRefCheck() {}}
                                    onChange={(e) => {
                                        setTypeTmp(e.label);
                                        seleccionarTPokemonType(e);
                                    }}
                                    onChangeTraditional={function noRefCheck() {}}
                                    options={types}
                                    prefixText=""
                                />
                            </div>
                            <div className="py-3">
                                <Input
                                    label="TYPES"
                                    width="100%"
                                    description="separated by commas"
                                    value={pokemon.types_name.toString()}
                                    onChange={(e) => {
                                        if (e.target.value == "") {
                                            setPokemon({ ...pokemon, types_name: [] });
                                            setWeaknesses([]);
                                        } else setPokemon({ ...pokemon, types_name: e.target.value.split(",") });
                                    }}
                                />
                            </div>
                            <div className="py-3">
                                <Input label="WEAKNESSES" width="100%" disabled value={weaknesses.toString()} />
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
