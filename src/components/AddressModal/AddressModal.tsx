/// <reference types="@types/google.maps" />
import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import CenteredLoading from "../CenterLoading";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateUserMutation } from "@/services/userApi";
import { Navigate } from "react-router-dom";
interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
  initialAddress?: string;
  isSave:boolean
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialAddress = "",
  isSave=false
}) => {
  const {loginUser,isLoading:isLoadingAuth,isAuthenticated} = useAuth()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [address, setAddress] = useState(initialAddress);
  const [searchRange, setSearchRange] = useState(5);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // 当 isOpen 变为 false 时重置状态
  useEffect(() => {
    if (!isOpen) {
      // 重置地址为初始值
      setAddress(initialAddress);
      
      // 清除地图相关引用
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      
      mapInstanceRef.current = null;
      autocompleteRef.current = null;
    }
  }, [isOpen, initialAddress]);

  // 加载 Google Maps API
  useEffect(() => {
    if (!isOpen) return;

    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          // 初始化地图
          const defaultLocation = { lat: 45.4215, lng: -75.6972 }; // Ottawa
          
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
            mapTypeControl: false,
          });

          // 添加地图点击事件
          mapInstanceRef.current.addListener("click", async (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              // 使用反向地理编码获取地址
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: e.latLng },
                (
                  results: google.maps.GeocoderResult[] | null,
                  status: google.maps.GeocoderStatus
                ) => {
                  if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const clickedAddress = results[0].formatted_address;
                    setAddress(clickedAddress);
                    
                    // 更新标记位置
                    if (markerRef.current) {
                      markerRef.current.setPosition(e.latLng!);
                    } else {
                      markerRef.current = new google.maps.Marker({
                        position: e.latLng!,
                        map: mapInstanceRef.current,
                        icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          fillColor: "#4B3621",
                          fillOpacity: 1,
                          strokeWeight: 0,
                          scale: 10,
                        },
                      });
                    }
                    
                    // 更新圆圈位置
                    if (circleRef.current) {
                      circleRef.current.setCenter(e.latLng!);
                    } else {
                      circleRef.current = new google.maps.Circle({
                        strokeColor: "#4B3621",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#4B3621",
                        fillOpacity: 0.1,
                        map: mapInstanceRef.current,
                        center: e.latLng!,
                        radius: searchRange * 1000,
                        clickable: true
                      });
                      
                      // 直接为新创建的圆圈添加点击事件
                      addCircleClickListener(circleRef.current, google);
                    }
                  }
                }
              );
            }
          });

          // 初始化地址自动完成
          const inputElement = document.getElementById("address-input") as HTMLInputElement;
          autocompleteRef.current = new google.maps.places.Autocomplete(inputElement, {
            fields: ["formatted_address", "geometry"],
          });

          // 监听地址选择事件
          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.geometry?.location) {
              setAddress(place.formatted_address || "");
              
              // 更新地图位置
              mapInstanceRef.current?.setCenter(place.geometry.location);
              
              // 添加标记
              if (markerRef.current) {
                markerRef.current.setPosition(place.geometry.location);
              } else {
                markerRef.current = new google.maps.Marker({
                  position: place.geometry.location,
                  map: mapInstanceRef.current,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#4B3621",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 10,
                  },
                });
              }
              
              // 添加搜索范围圆圈
              if (circleRef.current) {
                circleRef.current.setCenter(place.geometry.location);
                circleRef.current.setRadius(searchRange * 1000);
              } else {
                circleRef.current = new google.maps.Circle({
                  strokeColor: "#4B3621",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#4B3621",
                  fillOpacity: 0.1,
                  map: mapInstanceRef.current,
                  center: place.geometry.location,
                  radius: searchRange * 1000,
                  clickable: true
                });
                
                // 直接为新创建的圆圈添加点击事件
                addCircleClickListener(circleRef.current, google);
              }
            }
          });

          // 如果有初始地址，尝试地理编码
          if (initialAddress) {
            const geocoder = new google.maps.Geocoder();
            void geocoder.geocode(
              { address: initialAddress },
              (
                results: google.maps.GeocoderResult[] | null,
                status: google.maps.GeocoderStatus
              ) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                  const location = results[0].geometry.location;
                  
                  mapInstanceRef.current?.setCenter(location);
                  
                  markerRef.current = new google.maps.Marker({
                    position: location,
                    map: mapInstanceRef.current,
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: "#4B3621",
                      fillOpacity: 1,
                      strokeWeight: 0,
                      scale: 10,
                    },
                  });
                  
                  circleRef.current = new google.maps.Circle({
                    strokeColor: "#4B3621",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#4B3621",
                    fillOpacity: 0.1,
                    map: mapInstanceRef.current,
                    center: location,
                    radius: searchRange * 1000,
                    clickable: true
                  });
                  
                  // 直接为新创建的圆圈添加点击事件
                  addCircleClickListener(circleRef.current, google);
                }
              }
            );
          }
          
          // 辅助函数：为圆圈添加点击事件监听器
          function addCircleClickListener(circle: google.maps.Circle, googleObj: typeof google) {
            // 移除之前的圆圈点击监听器（如果有）
            googleObj.maps.event.clearListeners(circle, 'click');
            
            // 添加圆圈点击监听器
            circle.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng) {
                // 使用反向地理编码获取地址
                const geocoder = new googleObj.maps.Geocoder();
                void geocoder.geocode(
                  { location: e.latLng },
                  (
                    results: google.maps.GeocoderResult[] | null,
                    status: google.maps.GeocoderStatus
                  ) => {
                    if (status === googleObj.maps.GeocoderStatus.OK && results && results[0]) {
                      const clickedAddress = results[0].formatted_address;
                      setAddress(clickedAddress);
                      
                      // 更新标记位置
                      if (markerRef.current) {
                        markerRef.current.setPosition(e.latLng);
                      } else {
                        markerRef.current = new googleObj.maps.Marker({
                          position: e.latLng,
                          map: mapInstanceRef.current,
                          icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                          },
                        });
                      }
                      
                      // 更新圆圈中心位置
                      circleRef.current?.setCenter(e.latLng);
                    }
                  }
                );
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    void initMap();
  }, [isOpen, initialAddress]);

  // 更新搜索范围
  useEffect(() => {
    if (circleRef.current && mapInstanceRef.current) {
      circleRef.current.setRadius(searchRange * 1000);
      circleRef.current.setOptions({
        clickable: true
      });
    }
  }, [searchRange]);

  if (isLoadingAuth||isUpdating) return <CenteredLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace/>;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Select Location</h2>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Intersection, street, landmark or address *</span>
            </label>
            <input
              id="address-input"
              type="text"
              className="input input-bordered"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div 
            ref={mapRef} 
            className="w-full h-80 rounded-lg mb-4"
          ></div>
          
          {/* 地图缩放控制按钮 */}
          <div className="flex justify-end mb-2">
            <div className="flex shadow rounded-lg overflow-hidden">
              <button 
                type="button"
                className="bg-white px-3 py-1 hover:bg-gray-100"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 12) + 1);
                  }
                }}
              >
                <span className="text-xl">+</span>
              </button>
              <button 
                type="button"
                className="bg-white px-3 py-1 border-l hover:bg-gray-100"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 12) - 1);
                  }
                }}
              >
                <span className="text-xl">−</span>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Search Range</span>
              <span className="label-text-alt">{searchRange} km</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={searchRange}
              onChange={(e) => setSearchRange(Number(e.target.value))}
              className="range range-sm range-primary"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>1</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (isSave) {
                  void updateUser({
                    userId: loginUser?._id??'',
                    address: address
                  });
                }
                onSelect(address);
                onClose();
              }}
              disabled={!address}
            >
              Set Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal; 