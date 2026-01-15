import React, { useState } from 'react';
import { Search, MapPin, X, Navigation, Phone, Droplets } from 'lucide-react';
// [중요] VS Code에서 실행할 때는 아래 줄의 주석(//)을 지워서 활성화하세요!
// import { Map, MapMarker } from "react-kakao-maps-sdk";

// [중요] VS Code에서 실행할 때는 아래의 '임시 Map 컴포넌트'부터 '여기까지' 코드를 모두 지우세요!
// --- 임시 Map 컴포넌트 시작 (미리보기용) ---
const Map = ({ center, style, level, children }) => (
  <div style={{ ...style, backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
    <p style={{ color: '#64748b', fontWeight: 'bold', zIndex: 10 }}>실제 카카오맵은 로컬에서 표시됩니다</p>
    <p style={{ color: '#94a3b8', fontSize: '0.8rem', zIndex: 10 }}>중심 좌표: {center.lat}, {center.lng}</p>
    {children}
  </div>
);
const MapMarker = ({ position, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      position: 'absolute', 
      left: '50%', 
      top: '50%', 
      transform: 'translate(-50%, -100%)', // 대략적인 위치 흉내
      cursor: 'pointer',
      zIndex: 20
    }}
  >
    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" style={{width: '24px', height: '35px'}} alt="marker"/>
  </div>
);
// --- 임시 Map 컴포넌트 끝 (여기까지 지우세요) ---

// 데이터: 서울의 실제 좌표가 들어있습니다.
const MOCK_DATA = [
  {
    id: 1,
    name: "마포구민체육센터",
    location: "서울 마포구 월드컵로 25길",
    status: "OPEN",
    time: "06:00 - 22:00",
    freeSwimTime: "08:00 - 08:50",
    price: "4,000원",
    tags: ["50m레인", "자연채광"],
    lat: 37.5642135,
    lng: 126.9016985
  },
  {
    id: 2,
    name: "올림픽수영장",
    location: "서울 송파구 올림픽로",
    status: "BREAK",
    time: "09:00 - 18:00",
    freeSwimTime: "13:00 - 13:50",
    price: "5,000원",
    tags: ["국제규격", "다이빙풀"],
    lat: 37.515904, 
    lng: 127.125585
  },
  {
    id: 3,
    name: "서울 YMCA 수영장",
    location: "서울 종로구 종로 69",
    status: "OPEN",
    time: "06:00 - 21:00",
    freeSwimTime: "09:00 - 11:50",
    price: "8,000원",
    tags: ["역사깊은", "종로중심"],
    lat: 37.570028,
    lng: 126.985054
  },
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPool, setSelectedPool] = useState(null);
  
  // 지도의 중심 좌표 (기본값: 서울시청)
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });

  const filteredPools = MOCK_DATA.filter((pool) =>
    pool.name.includes(searchTerm) || pool.location.includes(searchTerm)
  );

  const handlePoolClick = (pool) => {
    setSelectedPool(pool);
    setCenter({ lat: pool.lat, lng: pool.lng }); 
  };

  return (
    <div className="app-container">
      <style>{`
        :root { width: 100%; max-width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
        body { margin: 0 !important; padding: 0 !important; display: block !important; place-items: unset !important; min-width: 100% !important; min-height: 100vh; background-color: #f8fafc; }
        #root { width: 100%; max-width: 100%; margin: 0 auto; padding: 0; text-align: left; }

        .app-container { font-family: 'Pretendard', sans-serif; min-height: 100vh; color: #334155; width: 100%; position: relative; }
        .header { position: fixed; top: 0; left: 0; width: 100%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid #e2e8f0; z-index: 100; height: 64px; display: flex; align-items: center; justify-content: center; }
        .header-content { width: 100%; max-width: 1200px; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 1.25rem; color: #0f172a; }
        .logo-icon { background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .main { padding-top: 100px; padding-bottom: 40px; max-width: 1200px; width: 100%; margin: 0 auto; padding-left: 20px; padding-right: 20px; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }
        .hero-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; color: #0f172a; text-align: center; word-break: keep-all; }
        .hero-desc { font-size: 1.1rem; color: #64748b; margin-bottom: 40px; text-align: center; word-break: keep-all; }
        
        .search-box { position: relative; width: 100%; max-width: 600px; margin-bottom: 40px; }
        .search-input { width: 100%; padding: 16px 20px 16px 50px; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); outline: none; transition: all 0.2s; box-sizing: border-box; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

        .dashboard { width: 100%; height: 600px; background: white; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; display: flex; overflow: hidden; }
        .list-view { width: 350px; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; }
        .list-header { padding: 20px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; font-weight: 600; }
        .list-content { flex: 1; overflow-y: auto; padding: 10px; }
        .pool-card { padding: 16px; border-radius: 12px; cursor: pointer; border: 1px solid transparent; margin-bottom: 8px; transition: all 0.2s; }
        .pool-card:hover { background: #f1f5f9; }
        .pool-card.active { background: #eff6ff; border-color: #bfdbfe; }
        .tag { font-size: 0.75rem; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-right: 6px; color: #475569; }
        .status-badge { font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
        .status-OPEN { background: #dcfce7; color: #15803d; }
        .status-CLOSED { background: #fee2e2; color: #b91c1c; }
        .status-BREAK { background: #ffedd5; color: #c2410c; }

        /* 지도 영역 스타일 */
        .map-view { flex: 1; background: #f1f5f9; position: relative; overflow: hidden; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal-content { background: white; width: 90%; max-width: 400px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: slideUp 0.3s ease-out; }
        .modal-header { background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 24px; color: white; position: relative; }
        .close-btn { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.1); border: none; color: white; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .modal-body { padding: 24px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .info-label { color: #64748b; font-size: 0.9rem; }
        .info-value { font-weight: 600; color: #0f172a; }
        .highlight-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn { flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #f1f5f9; color: #334155; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 768px) { .hero-title { font-size: 1.8rem; } .dashboard { flex-direction: column; height: auto; } .list-view { width: 100%; height: 300px; border-right: none; border-bottom: 1px solid #e2e8f0; } .map-view { height: 400px; } .header-content { padding: 0 16px; } .main { padding-left: 16px; padding-right: 16px; } }
      `}</style>

      {/* 헤더 */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon"><Droplets size={20} /></div>
            <span>SwimMap</span>
          </div>
          <button style={{padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold'}}>
            로그인
          </button>
        </div>
      </header>

      {/* 메인 */}
      <main className="main">
        <h1 className="hero-title">오늘, 물살을 가를<br className="md:hidden"/> 준비 되셨나요?</h1>
        <p className="hero-desc">내 주변 자유수영 가능한 수영장을<br className="md:hidden"/> 실시간으로 확인하세요.</p>

        {/* 검색창 */}
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            className="search-input"
            placeholder="지역명 또는 수영장 이름 (예: 마포, 종로)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 대시보드 */}
        <div className="dashboard">
          {/* 왼쪽 리스트 */}
          <div className="list-view">
            <div className="list-header">
              검색 결과 <span style={{color: '#2563eb'}}>{filteredPools.length}</span>곳
            </div>
            <div className="list-content">
              {filteredPools.map((pool) => (
                <div 
                  key={pool.id}
                  className={`pool-card ${selectedPool?.id === pool.id ? 'active' : ''}`}
                  onClick={() => handlePoolClick(pool)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <strong style={{fontSize: '1.1rem'}}>{pool.name}</strong>
                    <StatusBadge status={pool.status} />
                  </div>
                  <div style={{color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                    <MapPin size={14} /> {pool.location}
                  </div>
                   <div style={{fontSize: '0.85rem', color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '8px', fontWeight: 'bold'}}>
                    🏊 자유수영: {pool.freeSwimTime}
                  </div>
                  <div>
                    {pool.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 지도 (진짜 카카오맵) */}
          <div className="map-view">
            <Map 
              center={center} 
              style={{ width: "100%", height: "100%" }}
              level={5} 
            >
              {filteredPools.map((pool) => (
                <MapMarker
                  key={pool.id}
                  position={{ lat: pool.lat, lng: pool.lng }}
                  onClick={() => handlePoolClick(pool)}
                  image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                    size: { width: 24, height: 35 },
                  }}
                />
              ))}
            </Map>
          </div>
        </div>
      </main>

      {/* 팝업 모달 */}
      {selectedPool && (
        <div className="modal-overlay" onClick={() => setSelectedPool(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{fontSize: '1.5rem', margin: 0}}>{selectedPool.name}</h2>
              <p style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <MapPin size={14} /> {selectedPool.location}
              </p>
              <button className="close-btn" onClick={() => setSelectedPool(null)}><X size={20}/></button>
            </div>
            
            <div className="modal-body">
              <div className="highlight-box">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{background: 'white', padding: '8px', borderRadius: '50%', color: '#2563eb'}}><Droplets size={20}/></div>
                  <div>
                    <div style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold'}}>자유수영 시간</div>
                    <div style={{fontSize: '1.1rem', fontWeight: '800', color: '#2563eb'}}>{selectedPool.freeSwimTime}</div>
                  </div>
                </div>
                <StatusBadge status={selectedPool.status} />
              </div>

              <div className="info-row">
                <span className="info-label">전체 운영</span>
                <span className="info-value">{selectedPool.time}</span>
              </div>
              <div className="info-row">
                <span className="info-label">일일 입장료</span>
                <span className="info-value">{selectedPool.price}</span>
              </div>
              
              <div className="btn-group">
                <button className="btn btn-secondary"><Phone size={18}/> 전화</button>
                <button className="btn btn-primary"><Navigation size={18}/> 길찾기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge status-${status}`}>
      {status === 'OPEN' ? '영업중' : status === 'CLOSED' ? '영업종료' : '휴게시간'}
    </span>
  );
}

export default App;