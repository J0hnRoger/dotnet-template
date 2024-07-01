import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function Shield3D({ spell, color, play, ...props }) {
    const { nodes, animations } = useGLTF('models/shield.glb')
    const group = useRef()
    const { actions } = useAnimations(animations, group)

    useEffect(() => {
        if (play)
            actions["SphereAction.001"]
                .setLoop(THREE.LoopOnce, 1)
                .reset().play()

        actions["Sphere.002Action.001"]
            .setLoop(THREE.LoopOnce, 1)
            .reset().play()
    }, [color, play, spell])

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene" scale={0.3}>
                <mesh
                    name="Sphere"
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere.geometry}
                    material={new THREE.MeshStandardMaterial({
                        color
                    })}
                    scale={0.103}
                />
                <mesh
                    name="Sphere002"
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere002.geometry}
                    material={new THREE.MeshStandardMaterial({
                        color
                    })}
                    rotation={[-1.708, -0.785, 2.089]}
                    scale={0.097}
                />
            </group>
        </group>
    )
}

useGLTF.preload('models/shield.glb')