import * as THREE from 'three';
import { SPHERE_RADIUS } from '../data/constants';
import { PSVError } from '../PSVError';
import { parseAngle, parseSpeed } from '../utils';
import { AbstractService } from './AbstractService';

const vector2 = new THREE.Vector2();
const vector3 = new THREE.Vector3();

/**
 * @summary Collections of data converters for the current viewer
 * @extends PSV.services.AbstractService
 * @memberof PSV.services
 */
export class DataHelper extends AbstractService {

  /**
   * @param {PSV.Viewer} psv
   */
  constructor(psv) {
    super(psv);
  }

  /**
   * @summary Converts vertical FOV to zoom level
   * @param {number} fov
   * @returns {number}
   */
  fovToZoomLevel(fov) {
    const temp = Math.round((fov - this.config.minFov) / (this.config.maxFov - this.config.minFov) * 100);
    return temp - 2 * (temp - 50);
  }

  /**
   * @summary Converts zoom level to vertical FOV
   * @param {number} level
   * @returns {number}
   */
  zoomLevelToFov(level) {
    return this.config.maxFov + (level / 100) * (this.config.minFov - this.config.maxFov);
  }

  /**
   * @summary Convert vertical FOV to horizontal FOV
   * @param {number} vFov
   * @returns {number}
   */
  vFovToHFov(vFov) {
    return THREE.Math.radToDeg(2 * Math.atan(Math.tan(THREE.Math.degToRad(vFov) / 2) * this.prop.aspect));
  }

  /**
   * @summary Converts a speed into a duration from current position to a new position
   * @param {string|number} value
   * @param {number} angle
   * @returns {number}
   */
  speedToDuration(value, angle) {
    if (!value || typeof value !== 'number') {
      // desired radial speed
      const speed = value ? parseSpeed(value) : this.config.autorotateSpeed;
      // compute duration
      return angle / Math.abs(speed) * 1000;
    }
    else {
      return Math.abs(value);
    }
  }

  /**
   * @summary Converts pixel texture coordinates to spherical radians coordinates
   * @param {PSV.Point} point
   * @returns {PSV.Position}
   */
  textureCoordsToSphericalCoords(point) {
    const panoData = this.prop.panoData;
    if (!panoData) {
      throw new PSVError('Current adapter does not support texture coordinates.');
    }

    const relativeX = (point.x + panoData.croppedX) / panoData.fullWidth * Math.PI * 2;
    const relativeY = (point.y + panoData.croppedY) / panoData.fullHeight * Math.PI;

    return {
      longitude: relativeX >= Math.PI ? relativeX - Math.PI : relativeX + Math.PI,
      latitude : Math.PI / 2 - relativeY,
    };
  }

  /**
   * @summary Converts spherical radians coordinates to pixel texture coordinates
   * @param {PSV.Position} position
   * @returns {PSV.Point}
   */
  sphericalCoordsToTextureCoords(position) {
    const panoData = this.prop.panoData;
    if (!panoData) {
      throw new PSVError('Current adapter does not support texture coordinates.');
    }

    const relativeLong = position.longitude / Math.PI / 2 * panoData.fullWidth;
    const relativeLat = position.latitude / Math.PI * panoData.fullHeight;

    return {
      x: Math.round(position.longitude < Math.PI ? relativeLong + panoData.fullWidth / 2 : relativeLong - panoData.fullWidth / 2) - panoData.croppedX,
      y: Math.round(panoData.fullHeight / 2 - relativeLat) - panoData.croppedY,
    };
  }

  /**
   * @summary Converts spherical radians coordinates to a THREE.Vector3
   * @param {PSV.Position} position
   * @param {external:THREE.Vector3} [vector]
   * @returns {external:THREE.Vector3}
   */
  sphericalCoordsToVector3(position, vector) {
    if (!vector) {
      vector = new THREE.Vector3();
    }
    vector.x = SPHERE_RADIUS * -Math.cos(position.latitude) * Math.sin(position.longitude);
    vector.y = SPHERE_RADIUS * Math.sin(position.latitude);
    vector.z = SPHERE_RADIUS * Math.cos(position.latitude) * Math.cos(position.longitude);
    return vector;
  }

  /**
   * @summary Converts a THREE.Vector3 to spherical radians coordinates
   * @param {external:THREE.Vector3} vector
   * @returns {PSV.Position}
   */
  vector3ToSphericalCoords(vector) {
    const phi = Math.acos(vector.y / Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z));
    const theta = Math.atan2(vector.x, vector.z);

    return {
      longitude: theta < 0 ? -theta : Math.PI * 2 - theta,
      latitude : Math.PI / 2 - phi,
    };
  }

  /**
   * @summary Converts position on the viewer to a THREE.Vector3
   * @param {PSV.Point} viewerPoint
   * @returns {external:THREE.Vector3}
   */
  viewerCoordsToVector3(viewerPoint) {
    vector2.x = 2 * viewerPoint.x / this.prop.size.width - 1;
    vector2.y = -2 * viewerPoint.y / this.prop.size.height + 1;

    this.psv.renderer.raycaster.setFromCamera(vector2, this.psv.renderer.camera);

    const intersects = this.psv.renderer.raycaster.intersectObjects(this.psv.renderer.scene.children, true);

    if (intersects.length === 1) {
      return intersects[0].point;
    }
    else {
      return null;
    }
  }

  /**
   * @summary Converts a THREE.Vector3 to position on the viewer
   * @param {external:THREE.Vector3} vector
   * @returns {PSV.Point}
   */
  vector3ToViewerCoords(vector) {
    const vectorClone = vector.clone();
    vectorClone.project(this.psv.renderer.camera);

    return {
      x: Math.round((vectorClone.x + 1) / 2 * this.prop.size.width),
      y: Math.round((1 - vectorClone.y) / 2 * this.prop.size.height),
    };
  }

  /**
   * @summary Converts spherical radians coordinates to position on the viewer
   * @param {PSV.Position} position
   * @returns {PSV.Point}
   */
  sphericalCoordsToViewerCoords(position) {
    return this.vector3ToViewerCoords(this.sphericalCoordsToVector3(position, vector3));
  }

  /**
   * @summary Converts x/y to latitude/longitude if present and ensure boundaries
   * @param {PSV.ExtendedPosition} position
   * @returns {PSV.Position}
   */
  cleanPosition(position) {
    if ('x' in position && 'y' in position) {
      return this.textureCoordsToSphericalCoords(position);
    }
    else {
      return {
        longitude: parseAngle(position.longitude),
        latitude : parseAngle(position.latitude, true),
      };
    }
  }

  /**
   * @summary Ensure a SphereCorrection object is valid
   * @param {PSV.SphereCorrection} sphereCorrection
   * @returns {PSV.SphereCorrection}
   */
  cleanSphereCorrection(sphereCorrection) {
    return {
      pan : parseAngle(sphereCorrection.pan || 0),
      tilt: parseAngle(sphereCorrection.tilt || 0, true),
      roll: parseAngle(sphereCorrection.roll || 0, true, false),
    };
  }

}
