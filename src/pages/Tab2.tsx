import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonText, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonLoading, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { AudioData, useAudio } from '../hooks/useAudio'
import './style.css';
import { useEffect, useState } from 'react';
import { camera, images, pause, pencil, play, trash, stop, refresh } from 'ionicons/icons';
import { defaultIncident, Incident, IncidentData } from '../models/IncidentData';
import { usePhotoGallery } from '../hooks/usePhotoGallery';

const Tab2: React.FC = () => {
  const [selectedIncident, setSelectedEvent] = useState<Incident>(defaultIncident);
  const { loadIncidents, incidents, readIncident, updateIncident, deleteIncident } = IncidentData();
  const [presentImageLoading, dismissImageLoading] = useIonLoading();
  const { takePhoto, pickPhoto } = usePhotoGallery();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const { getAudioPath, selectAudioFile, preloadAudio, playAudio, pauseAudio, stopAudio, unloadAudio, isPlayingAudio } = useAudio();
  const [audioPreview, setAudioPreview] = useState("");
  const isAudioPlaying = isPlayingAudio(audioPreview);
  const isAudioSet = () => { return audioPreview.length != 0 };
  const [isPageLoaded, setPageLoaded] = useState(false);

  async function selectAudio() {
    if (isAudioSet()) {
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

  async function openUpdateEventModal(id: string) {
    await presentImageLoading({ message: 'Cargando incidente' });
    const readedEvent = await readIncident(id);
    setSelectedEvent(readedEvent);
    setPhotoPreview(readedEvent.photo.webviewPath);
    dismissImageLoading();
    setUpdateModalOpen(true);
  }

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const audioId = "appAudio";

  // useIonViewDidLeave(() => {
  //   setPageLoaded(false);
  // })

  // useIonViewDidEnter(() => {
  //   if (!isPageLoaded) {
  //     loadIncidents();
  //     setPageLoaded(true);
  //   }
    
  // });

  useIonViewDidEnter(() => {
    if (!isPageLoaded) {
      loadIncidents();
      setPageLoaded(true);
    }
    
  });



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visualización de Incidencias</IonTitle>
          <IonButtons slot='end'>
            <IonButton fill='solid' onClick={() => {loadIncidents()}}><IonIcon md={refresh}/></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {incidents.map((incident, key) => {
            return (
              <IonItem key={key}>
                <IonCard style={{ width: "100%" }}>
                  <IonThumbnail>
                    <img src={incident.photo?.webviewPath} alt="Imagen del incidente" />
                  </IonThumbnail>
                  <IonCardHeader>
                    <IonCardTitle>
                      {incident.title}
                      <IonButtons slot='end'>
                        <IonButton>Editar</IonButton>
                      </IonButtons>
                    </IonCardTitle>
                    <IonCardSubtitle>{incident.date}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>{incident.description}</IonText>
                  </IonCardContent>
                  <IonToolbar>

                    <IonButtons slot='start' className='ion-padding'>
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
                        onClick={() => stopAudio(audioPreview)}
                      ><IonIcon md={stop} /></IonButton>
                    </IonButtons>

                    <IonButtons slot='end' className='ion-padding'>
                      <IonButton
                        fill='solid'
                        color='primary'
                        id="update-incident-modal"
                        onClick={() => { openUpdateEventModal(incident.id) }}>
                        <IonIcon md={pencil} />
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>

        <IonModal isOpen={isUpdateModalOpen} backdropDismiss={false} >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setUpdateModalOpen(false)}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Editando incidente</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Titulo"
              labelPlacement="floating"
              fill="solid"
              placeholder="Nuevo incidente"
              value={selectedIncident.title}
              onIonInput={(ev) => selectedIncident.title = (ev.currentTarget as HTMLInputElement).value}
            />
            <br />
            <IonTextarea
              label="Descripcion"
              labelPlacement="floating"
              fill="solid"
              placeholder="Escriba la descripcion de este incidente..."
              value={selectedIncident.description}
              autoGrow={true}
              rows={4}
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
                setUpdateModalOpen(false);
                updateIncident(selectedIncident);
              }}>
              Confirmar cambios
            </IonButton>
            <IonButtons slot='end'>
              <IonButton
                fill='solid'
                onClick={() => {
                  setUpdateModalOpen(false);
                  deleteIncident(selectedIncident.id);
                }}><IonIcon md={trash} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
