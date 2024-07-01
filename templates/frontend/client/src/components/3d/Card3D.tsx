// @ts-nocheck
import { useGLTF } from '@react-three/drei'

export function Card3D({ cardName, ...props }) {
    const { nodes, materials } = useGLTF('models/card.glb')
    const texture = useTexture(`images/${cardName}`)

    return (
        <group {...props} dispose={null}>
            <mesh castShadow receiveShadow geometry={nodes.Plane.geometry}>
                <meshStandardMaterial {...materials.Front} map={texture} color={"white"}></meshStandardMaterial>
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_1.geometry}
                material={materials.Borders}
            />
            <mesh castShadow receiveShadow geometry={nodes.Plane_2.geometry} material={materials.Back} />
        </group>
    )
}

useGLTF.preload('models/card.glb')
