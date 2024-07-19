import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { triangle, ellipse, square } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

const Tabs: React.FC = () => {

    return (
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/tab1" component={Tab1} />
            <Route path="/tab2" component={Tab2} />
            <Route path="/tab3" component={Tab3} />
            <Route exact path="/">
              <Redirect to="/tab2" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={triangle} />
              <IonLabel>Registrar</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={ellipse} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={square} />
              <IonLabel>Acerca de</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
    );
}

export default Tabs;