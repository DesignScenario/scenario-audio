import glow from '../assets/images/brilho-dispositivo.svg';
import { MODEL_ZONES } from '../config/audioLimits';
import type { DeviceModel } from '../types';
import './DeviceThumb.css';

/**
 * Miniatura do equipamento.
 * O Figma ainda não tem fotos do SMA4/SMA6. Seguimos a moldura das imagens de
 * dispositivo do Embrace Power (fundo preto, raio 6px, brilho radial "Ellipse 69")
 * e desenhamos uma silhueta neutra de amplificador, com um LED por zona.
 * Troque pelo asset oficial assim que ele existir (ver docs/design-system.md).
 */
export function DeviceThumb({ model, size = 64 }: { model: DeviceModel; size?: number }) {
  const zones = MODEL_ZONES[model];
  return (
    <div className="device-thumb" style={{ width: size, height: size }} aria-hidden="true">
      <img className="device-thumb__glow" src={glow} width={80} height={80} alt="" />
      <div className="device-thumb__body">
        <div className="device-thumb__leds">
          {Array.from({ length: zones }, (_, i) => (
            <span key={i} className="device-thumb__led" />
          ))}
        </div>
        <span className="device-thumb__model">{model}</span>
      </div>
    </div>
  );
}
