import './styles.css';
import Api from '../../services/api';
import ApiIBGE from '../../services/ibge';
import {Link} from 'react-router-dom';
import logo from '../../assets/logo.svg';
import {FiArrowLeft} from 'react-icons/fi';
import React, {ChangeEvent, useEffect, useState} from "react";
import {MapContainer, Marker, TileLayer, useMapEvents} from 'react-leaflet';
import L from 'leaflet';


interface Item {
    id: number,
    title: string,
    image_url: string
}

interface Estado {
    sigla: string
}

interface City {
    nome: string
}


const Point = () => {

    //Ao criar estado para um Array ou Objeto, é necessário informar manualmente o tipo de variável
    const [items, setItems] = useState<Item[]>([]);
    //useEffect: (<Função a executar>, <Quando a mesma será executada>)
    useEffect(() => {
        Api.get('items').then(res => {
            setItems(res.data);
        })
    }, []);


    const [ufs, setUfs] = useState<string[]>([]);
    useEffect(() => {
        ApiIBGE.get<Estado[]>('?orderBy=nome').then(res => {
            const siglas = res.data.map(uf => uf.sigla)
            setUfs(siglas);
        })
    }, [])


    const [selectedUf, setSelectedUf] = useState('0')
    function handleSeletedUf(e: ChangeEvent<HTMLSelectElement>) {
        const uf = e.target.value
        setSelectedUf(uf)
    }


    const [cities, setCities] = useState<string[]>([]);
    useEffect(() => {
        if (selectedUf === '0')
            return

        ApiIBGE.get<City[]>(`/${selectedUf}/municipios`).then(res => {
            const cities = res.data.map(city => city.nome)
            setCities(cities);
        })
    }, [selectedUf])


    const [selectedCity, setSelectedCity] = useState('0')
    function handleSeletedCity(e: ChangeEvent<HTMLSelectElement>) {
        const city = e.target.value
        setSelectedCity(city)
    }


    const [initialPosition, setInitialPosition] = useState<[number, number]>([-37.2833743, -7.4857319])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-37.2833743, -7.4857319]);
    function HandleMapClick() {
        useMapEvents({
            click: (e) => {
                const {lat, lng} = e.latlng;
                setSelectedPosition([
                    lat,
                    lng
                ])
            }
        })
        return null;
    }



    useEffect(() => {

    }, [])


    function LocationMarker() {
        const map = useMapEvents({})
        return (
            <>
                {
                    navigator.geolocation.getCurrentPosition(position => {
                            const { latitude, longitude } = position.coords;
                            const coords: [number, number] = [latitude, longitude]
                            setInitialPosition(coords)
                            setSelectedPosition(coords)
                            map.flyTo(coords, 15)
                        }
                    )
                }
            </>
        )
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'>
                    <FiArrowLeft/>
                    Voltar
                </Link>
            </header>

            <form>
                <h1>Cadastro de ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <strong>Selecione o endselectedPositionereço no mapa</strong>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSeletedUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSeletedCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <MapContainer
                        center={initialPosition}
                        zoom={15}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                    >
                        <TileLayer
                            attribution='&copy;
                        <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <HandleMapClick/>
                        <LocationMarker />
                        <Marker position={selectedPosition}/>
                    </MapContainer>


                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <strong>Selecione um ou mais ítens abaixo</strong>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default Point;