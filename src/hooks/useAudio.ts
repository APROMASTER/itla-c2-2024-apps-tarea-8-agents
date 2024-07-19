import { NativeAudio } from '@capacitor-community/native-audio';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';

export interface AudioData {
    name: string,
    filepath: string,
    webviewPath: string,
}

export function useAudio() {
    const getAudioPath = (audio: AudioData) => {
        const path = isPlatform('desktop') ? audio.webviewPath : audio.filepath ;
        return path;
    }

    const selectAudioFile = async (): Promise<AudioData | undefined> => {
        const result = await FilePicker.pickFiles({
            types: ['audio/*'],
            readData: true,
            limit: 1
        });

        if (result.files && result.files.length > 0) {
            const file = result.files[0];
            console.log(file);

            const savedFileAudio = await saveAudio(file);
            console.log(savedFileAudio);
            return (
                savedFileAudio
            );
        };
    }

    const saveAudio = async (audio: PickedFile): Promise<AudioData> => {
        const fileName = audio.name + "-" + new Date().getUTCSeconds;
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: audio.data as string,
            directory: Directory.Data,
        });

        const webpath = isPlatform('desktop') ? URL.createObjectURL(audio.blob as Blob) : "";
        
        return {
            name: audio.name,
            filepath: savedFile.uri,
            webviewPath: webpath,
        };
    };

    const preloadAudio = async (audioId: string, audioPath: string) => {
        await NativeAudio.preload({
            assetId: audioId,
            assetPath: audioPath,
            isUrl: true
        });
    };

    const isPlayingAudio = (audioId: string) : boolean => {
        let isPlaying = false;
        NativeAudio.isPlaying({
            assetId: audioId
        }).then((value) => {isPlaying = value.isPlaying;}).catch(() => {return false;});

        return isPlaying;
    };

    const playAudio = async (audioId: string) => {
        await NativeAudio.play({
            assetId: audioId
        });
    };

    const pauseAudio = async (audioId: string) => {
        await NativeAudio.pause({
            assetId: audioId
        });
    };

    const stopAudio = async (audioId: string) => {
        await NativeAudio.stop({
            assetId: audioId
        });
    };

    const unloadAudio = async (audioId: string) => {
        await NativeAudio.unload({
            assetId: audioId
        });
    };

    return {
        getAudioPath,
        selectAudioFile,
        preloadAudio,
        playAudio,
        pauseAudio,
        stopAudio,
        isPlayingAudio,
        unloadAudio
    }
}