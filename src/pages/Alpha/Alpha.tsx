import { Canvas } from '@react-three/fiber'
import { FiberWrapper } from '../../three/components/FiberWrapper'
import { usePotreeLoader } from '../../three/loaders/usePotreeLoader'

export function Alpha() {

    usePotreeLoader('https://assets.h3nr7.com/downsampled_test_23-03-2023.las_converted')

    return (
        <FiberWrapper>
            <color attach='background' args={['#eeeeee']} />
        </FiberWrapper>
    )
}