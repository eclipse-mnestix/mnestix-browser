import { Box, SxProps, Theme, useTheme } from '@mui/material';
import TileLayer from 'ol/layer/Tile';
import { useEffect, useRef } from 'react';
import OSM from 'ol/source/OSM';
import { Feature, Map, View } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { LineString, MultiLineString, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { Coordinate } from 'ol/coordinate';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { ProductLifecycleStage } from 'lib/enums/ProductLifecycleStage.enum';
import { ProductJourneyAddressList } from './ProductJourneyAddressList';

export type Address = {
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    cityTown?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
};

export type AddressPerLifeCyclePhase = {
    lifeCyclePhase: ProductLifecycleStage;
    address: Address;
};

export function ProductJourney(props: { addressesPerLifeCyclePhase: AddressPerLifeCyclePhase[] }) {
    const theme = useTheme();
    const mapElement = useRef<HTMLElement>(null);
    const mapRef = useRef<Map>(null);

    const coordinates: Coordinate[] = props.addressesPerLifeCyclePhase
        .filter((v) => v.address.latitude && v.address.longitude)
        .map((c) => [c.address.longitude as number, c.address.latitude as number]);

    useEffect(() => {
        if (mapElement.current && !mapRef.current) {
            const osmLayer = new TileLayer({
                preload: Infinity,
                source: new OSM(),
            });

            const markerLayers = getMarkerLayers(props.addressesPerLifeCyclePhase);

            const vectorLineLayer = getMultiLineLayer(coordinates, { lineColor: 'black' });

            const initialMap = new Map({
                target: mapElement.current,
                layers: [osmLayer, vectorLineLayer, ...markerLayers],
                view: new View({
                    center: [0, 0],
                    zoom: 1,
                }),
            });

            fitMapToMarkers(initialMap, vectorLineLayer.getSource());

            mapRef.current = initialMap;
        }
    }, [coordinates, theme, mapElement, mapRef, props.addressesPerLifeCyclePhase]);

    const attributionStyling: SxProps<Theme> = {
        '& .ol-overlaycontainer-stopevent': {
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'row-reverse',
        },
        '& .ol-attribution.ol-uncollapsible button': { display: 'none' },
        '& .ol-attribution.ol-uncollapsible': {
            bottom: 0,
            right: 0,
            height: '1.1em',
            lineHeight: '1em',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px 0 0',
        },
        '& .ol-attribution li': { display: 'inline', listStyle: 'none', lineHeight: 'inherit' },
        '& .ol-attribution ul': { display: 'inline-block', margin: 0, padding: 0, fontSize: '0.8rem' },
        '& .ol-rotate': { display: 'none' },
        '& .ol-zoom': { display: 'none' },
    };

    return (
        <>
            <Box
                id="map"
                data-testid="product-journey-box"
                sx={{
                    height: '320px',
                    width: '100%',
                    marginTop: 2,
                    ...attributionStyling,
                }}
                ref={mapElement}
                className="map-container"
            />
            <ProductJourneyAddressList addressesPerLifeCyclePhase={props.addressesPerLifeCyclePhase} />
        </>
    );
}

function getMarkerLayers(coordinatesPerLifeCyclePhase: AddressPerLifeCyclePhase[]) {
    return coordinatesPerLifeCyclePhase
        .filter((v) => v.address.latitude && v.address.longitude)
        .map((phase) => {
            const coordinate: Coordinate = [phase.address.longitude as number, phase.address.latitude as number];
            const markerSource = new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point(fromLonLat(coordinate)),
                    }),
                ],
            });

            const markerIconName = `LocationMarker_${phase.lifeCyclePhase}`;

            return new VectorLayer({
                source: markerSource,
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: `/LocationMarkers/${markerIconName}.svg`,
                    }),
                }),
            });
        });
}

function getMultiLineLayer(coordinates: Coordinate[], options?: { lineColor: string }) {
    const lines: LineString[] = coordinates
        .slice(undefined, -1)
        .map((c, index) => getLineBetweenCoordinates(c, coordinates[index + 1]));

    const multiline = new MultiLineString(lines);

    return new VectorLayer({
        source: new VectorSource({
            features: [
                new Feature({
                    geometry: multiline,
                }),
            ],
        }),
        style: new Style({
            fill: new Fill({ color: options?.lineColor ?? '#000000' }),
            stroke: new Stroke({ color: options?.lineColor ?? '#000000', width: 2 }),
        }),
    });
}

function getLineBetweenCoordinates(start: Coordinate, end: Coordinate) {
    const transformedStart = transform(start, 'EPSG:4326', 'EPSG:3857');
    const transformedEnd = transform(end, 'EPSG:4326', 'EPSG:3857');
    return new LineString([transformedStart, transformedEnd]);
}

function fitMapToMarkers(map: Map, markerSource: VectorSource | null) {
    if (markerSource && !markerSource.getExtent().some((e) => e === Infinity)) {
        map.getView().fit(markerSource.getExtent(), { size: map.getSize(), padding: [60, 40, 20, 40], maxZoom: 12 });
    }
}
