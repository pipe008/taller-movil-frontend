import React from "react";
import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { personCircle, cube } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";
import Clientes from "./pages/Clientes/Clientes";
import Productos from "./pages/Productos/Productos";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';



const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/clientes" component={Clientes} />
          <Route exact path="/productos" component={Productos} />
          <Redirect exact from="/" to="/clientes" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="clientes" href="/clientes">
            <IonIcon icon={personCircle} />
            <IonLabel>Clientes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="productos" href="/productos">
            <IonIcon icon={cube} />
            <IonLabel>Productos</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
