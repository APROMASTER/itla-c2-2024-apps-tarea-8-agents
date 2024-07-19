import { IonButton, IonButtons, IonCard, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonPage, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonLoading, useIonViewWillEnter } from '@ionic/react';
import './style.css';
import { images, camera, play, pause, stop } from 'ionicons/icons';
import { useState } from 'react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { defaultIncident, Incident, IncidentData } from '../models/IncidentData';
import { AudioData, useAudio } from '../hooks/useAudio';

const Tab1: React.FC = () => {

  const { createIncident } = IncidentData();
  const { takePhoto, pickPhoto } = usePhotoGallery();
  const { getAudioPath, selectAudioFile, preloadAudio, playAudio, pauseAudio, stopAudio, unloadAudio, isPlayingAudio } = useAudio();
  // const defaultIncidentData = defaultIncident;
  const defaultIncidentData: Incident = { 
    id: "", 
    title: "", 
    description: "", 
    date: new Date().toLocaleDateString(), 
    photo: { filepath: "", webviewPath: "" }, 
    audio: {name: "", filepath: "", webviewPath: ""} 
};
  const [selectedIncident, setSelectedIncident] = useState<Incident>(defaultIncidentData);
  const [presentImageLoading, dismissImageLoading] = useIonLoading();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [audioPreview, setAudioPreview] = useState("");
  const isAudioPlaying = isPlayingAudio(audioPreview);
  const isAudioSet = () => { return audioPreview.length != 0 };
  
  useIonViewWillEnter(() => {
    resetIncidentValues();
  });

  const audioId = "appRegisterAudio";

  async function selectAudio() {
    if (isAudioSet()) 
    {
      unloadAudio(audioPreview);
      setAudioPreview("");
    }
    selectedIncident.audio = await selectAudioFile() as AudioData;
    setAudioPreview(audioId);
    preloadAudio(audioId, getAudioPath(selectedIncident.audio));
  }

  async function playPauseAudio(audio: string) {
    if (!isAudioSet()) return;
    if (isAudioPlaying) {
      pauseAudio(audio);
    } else {
      playAudio(audio);
    }
  }

  const resetIncidentValues = () => { // ---------------------- PENDIENTE ----------------------
    setSelectedIncident(defaultIncidentData);
    setPhotoPreview("");
    setAudioPreview("");
  }

  const pickEventPhoto = async () => {
    presentImageLoading({
      message: 'Importando imagen'
    });
    await pickPhoto()
      .then((photo) => {
        selectedIncident.photo = photo;
        setPhotoPreview(selectedIncident.photo.webviewPath);
      }).catch(() => console.log("pickPhoto action cancelled by user"))
      .finally(() => dismissImageLoading());
  }

  const takeEventPhoto = async () => {
    presentImageLoading({
      message: 'Importando imagen'
    });
    await takePhoto()
      .then((photo) => {
        selectedIncident.photo = photo;
        setPhotoPreview(selectedIncident.photo.webviewPath);
      }).catch(() => console.log("takePhoto action cancelled by user"))
      .finally(() => dismissImageLoading());
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de Incidencias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Titulo"
          labelPlacement="floating"
          fill="solid"
          placeholder="Nuevo incidente"
          value={selectedIncident?.title}
          onIonInput={(ev) => selectedIncident.title = (ev.currentTarget as HTMLInputElement).value}
        />
        <br />
        <IonTextarea
          label="Descripcion"
          labelPlacement="floating"
          fill="solid"
          rows={4}
          autoGrow={true}
          placeholder="Escriba la descripcion de este incidente..."
          value={selectedIncident.description}
          onIonInput={(ev) => selectedIncident.description = (ev.currentTarget as HTMLInputElement).value}
        />
        <br />
        <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

        <IonModal keepContentsMounted={true}>
          <IonDatetime
            value={selectedIncident.date == "" ? "" : new Date(selectedIncident.date).toISOString()}
            presentation='date'
            id="datetime"
            onIonChange={(ev) => selectedIncident.date = new Date(ev.detail.value as string).toLocaleDateString()}
          ></IonDatetime>
        </IonModal>
        <br />
        <IonCard>
          <IonToolbar>
            <IonTitle>Imagen</IonTitle>
            <IonButtons slot='end'>
              <IonButton
                fill='solid'
                color='primary'
                expand='block'
                onClick={() => pickEventPhoto()}>
                <IonIcon icon={images}></IonIcon>
              </IonButton>

              <IonButton
                fill='solid'
                color='primary'
                expand='block'
                onClick={() => takeEventPhoto()}>
                <IonIcon icon={camera}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonThumbnail>
            {photoPreview != "" ?
              <img src={photoPreview} alt={"previsualizacion de imagen nueva"} width="100%" height="100%" />
              : null}
          </IonThumbnail>
        </IonCard>

        <br />
        <IonCard>
          <IonToolbar>
            <IonTitle>Audio</IonTitle>
            <IonButtons>
              <IonButton 
              fill='solid'
              color='primary'
              expand='block'
              onClick={() => selectAudio()}
              >Importar audio</IonButton>

              {
                isAudioSet() ?
                  <IonLabel>Sonido seleccionado: {selectedIncident?.audio.name}</IonLabel> :
                  <IonLabel>Sonido seleccionado: Ninguno</IonLabel>
              }

              <IonButton 
              fill='solid'
              color='primary'
              expand='block'
              disabled={!isAudioSet()} 
              onClick={() => playPauseAudio(audioPreview)}
              >{
                isAudioPlaying ? <IonIcon md={pause} /> : <IonIcon md={play} />
                }</IonButton>

              <IonButton 
              fill='solid'
              color='primary'
              expand='block'
              disabled={!isAudioSet()} 
              onClick={() => stopAudio(audioId)}
              ><IonIcon md={stop} /></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonCard>

      </IonContent>
      <IonToolbar>
        <IonButton
          expand='block'
          strong={true}
          onClick={() => {
            createIncident(selectedIncident);
            resetIncidentValues();
          }}>
          Crear
        </IonButton>
        <IonButtons slot='end'>
          <IonButton
            fill='solid'
            onClick={() => {
              resetIncidentValues();
            }}>RESET
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonPage>
  );
};

export default Tab1;
