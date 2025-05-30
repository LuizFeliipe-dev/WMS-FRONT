
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Card, CardContent } from '@/components/ui/card';
import { Info, X } from 'lucide-react';

interface ProductInfo {
  id: string;
  name: string;
  location: string;
  quantity: number;
  dateAdded: string;
}

const mockProducts: ProductInfo[] = [
  { id: 'P001', name: 'Caixa de Papelão 30x20x15', location: 'A01', quantity: 24, dateAdded: '15/03/2023' },
  { id: 'P002', name: 'Monitor LED 24"', location: 'B03', quantity: 12, dateAdded: '22/04/2023' },
  { id: 'P003', name: 'Teclado Mecânico', location: 'C02', quantity: 18, dateAdded: '05/05/2023' },
  { id: 'P004', name: 'Headset Gaming', location: 'A04', quantity: 8, dateAdded: '12/06/2023' },
  { id: 'P005', name: 'Mouse Sem Fio', location: 'B01', quantity: 30, dateAdded: '28/07/2023' },
  { id: 'P006', name: 'Caixa de Som Bluetooth', location: 'C03', quantity: 15, dateAdded: '10/08/2023' },
  { id: 'P007', name: 'Notebook 15"', location: 'D02', quantity: 7, dateAdded: '18/09/2023' },
  { id: 'P008', name: 'Smartphone', location: 'A02', quantity: 22, dateAdded: '24/10/2023' },
  { id: 'P009', name: 'Tablet 10"', location: 'B04', quantity: 10, dateAdded: '05/11/2023' },
  { id: 'P010', name: 'Câmera DSLR', location: 'C01', quantity: 5, dateAdded: '15/12/2023' },
];

const Stats3DView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f5ff);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(30, 30, 0xaaaaaa, 0xe0e0e0);
    scene.add(gridHelper);
    
    // Create warehouse floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Setup raycaster for item selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const itemsMap = new Map();
    
    // Create warehouse racks function
    const createRack = (x: number, z: number, items: number, rackIndex: number) => {
      const rackGroup = new THREE.Group();
      
      // Create rack structure
      const rackGeometry = new THREE.BoxGeometry(3, 5, 1);
      const rackMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
      const rack = new THREE.Mesh(rackGeometry, rackMaterial);
      rack.position.set(x, 2.5, z);
      rack.castShadow = true;
      rack.receiveShadow = true;
      rackGroup.add(rack);
      
      // Add items to rack based on count
      for (let i = 0; i < items; i++) {
        const itemGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        
        // Random color for each item
        const hue = Math.random() * 0.2 + 0.5; // Range between 0.5 and 0.7 (blue to purple)
        const itemMaterial = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color().setHSL(hue, 0.7, 0.5),
          roughness: 0.3,
          metalness: 0.2,
          emissive: new THREE.Color(0x000000),
        });
        
        const item = new THREE.Mesh(itemGeometry, itemMaterial);
        
        // Position within rack (x: -1 to 1, y: 0 to 4, z: front of rack)
        const itemX = x + (Math.random() * 2 - 1);
        const itemY = 1 + Math.floor(i / 3);
        const itemZ = z - 0.1;
        
        item.position.set(itemX, itemY, itemZ);
        item.castShadow = true;
        
        // Store the product data with the mesh
        const productIndex = (rackIndex * 3 + i) % mockProducts.length;
        itemsMap.set(item.uuid, mockProducts[productIndex]);
        
        rackGroup.add(item);
      }
      
      scene.add(rackGroup);
      return rackGroup;
    };
    
    // Create warehouse with multiple racks
    const racks = [];
    const positions = [
      { x: -8, z: -8, items: 5 },
      { x: -8, z: -4, items: 8 },
      { x: -8, z: 0, items: 3 },
      { x: -8, z: 4, items: 7 },
      { x: -8, z: 8, items: 9 },
      
      { x: -3, z: -8, items: 4 },
      { x: -3, z: -4, items: 6 },
      { x: -3, z: 0, items: 2 },
      { x: -3, z: 4, items: 9 },
      { x: -3, z: 8, items: 5 },
      
      { x: 3, z: -8, items: 7 },
      { x: 3, z: -4, items: 3 },
      { x: 3, z: 0, items: 8 },
      { x: 3, z: 4, items: 2 },
      { x: 3, z: 8, items: 6 },
      
      { x: 8, z: -8, items: 9 },
      { x: 8, z: -4, items: 5 },
      { x: 8, z: 0, items: 3 },
      { x: 8, z: 4, items: 7 },
      { x: 8, z: 8, items: 4 },
    ];
    
    positions.forEach((pos, index) => {
      racks.push(createRack(pos.x, pos.z, pos.items, index));
    });
    
    // Highlight function for items
    const highlightItem = (object: THREE.Object3D | null) => {
      // Reset all items
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && 
            obj.material instanceof THREE.MeshStandardMaterial && 
            itemsMap.has(obj.uuid)) {
          obj.material.emissive.set(0x000000);
        }
      });
      
      // Highlight selected item
      if (object instanceof THREE.Mesh && 
          object.material instanceof THREE.MeshStandardMaterial && 
          itemsMap.has(object.uuid)) {
        object.material.emissive.set(0x555555);
      }
    };
    
    // Handle mouse click
    const handleMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        highlightItem(object);
        
        // Get product data if available
        if (itemsMap.has(object.uuid)) {
          const productData = itemsMap.get(object.uuid);
          setSelectedProduct(productData);
        }
      }
    };
    
    // Add event listener
    renderer.domElement.addEventListener('click', handleMouseClick, false);
    
    // Animation loop
    let frameId: number;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(frameId);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col relative">
      <div 
        ref={containerRef} 
        className="flex-1 w-full rounded-lg overflow-hidden"
      />
      
      {selectedProduct && (
        <div className="absolute bottom-4 right-4 max-w-xs">
          <Card className="shadow-lg">
            <div className="flex justify-between items-center p-3 border-b">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <h3 className="font-medium">Detalhes do Produto</h3>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <CardContent className="p-3">
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold">ID:</span> {selectedProduct.id}</p>
                <p className="text-sm"><span className="font-semibold">Nome:</span> {selectedProduct.name}</p>
                <p className="text-sm"><span className="font-semibold">Localização:</span> {selectedProduct.location}</p>
                <p className="text-sm"><span className="font-semibold">Quantidade:</span> {selectedProduct.quantity}</p>
                <p className="text-sm"><span className="font-semibold">Data de Entrada:</span> {selectedProduct.dateAdded}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Stats3DView;
