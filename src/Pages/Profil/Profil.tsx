import React, { useState, useEffect } from 'react'
import { useGet, usePost } from '@/Hooks/useFetch'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify";

export default function Profil() {
    const { data } = useGet('/api/profil')
    const { handleSubmit: post } = usePost()

    const [id, setId] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (data) {
            setId(data.data.id)
            setName(data.data.name)
            setImage(data.data.profile_picture)
        }
    }, [data])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                const img = new Image()
                img.src = reader.result as string
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const size = Math.min(img.width, img.height)
                    canvas.width = size
                    canvas.height = size
                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                        ctx.drawImage(
                            img,
                            (img.width - size) / 2,
                            (img.height - size) / 2,
                            size,
                            size,
                            0,
                            0,
                            size,
                            size
                        )
                        setImage(canvas.toDataURL('image/jpeg'))
                    }
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            id: id,
            name,
            image,
            password,
        }
        try {
            await post({
                url: '/api/profil',
                body: payload
            }).then(() => {
                toast.success('Profil updated')
            })
        } catch (error) {
            toast.error('Error updating profil')
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Profil</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Photo de profil</Label>
                        <div className="flex items-center space-x-4">
                            <img src={image} alt="avatar" className="w-12 h-12 rounded-full" />
                            <Input id="avatar" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Votre nom"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} className="w-full">
                    Enregistrer
                </Button>
            </CardFooter>
        </Card>
    )
}