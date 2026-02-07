import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, Loader2, ShieldCheck } from 'lucide-react';
import { ethers } from 'ethers';
import { ProjectCategory, PROJECT_PHASES } from '../types';

interface ProjectStatusTrackerProps {
  projectId: string; 
  currentPhase: number;
  category: ProjectCategory;
}

// --- BLOCKCHAIN CONFIG ---

const CONTRACT_ADDRESS = "0x30D86092b8cDCc555cC3fa059a0bc85E76e150ED"; 
const RPC_URL = "https://ethereum-sepolia.publicnode.com";
const ABI = ["function getProjectUpdates(uint256 _projectId) public view returns (tuple(uint256 timestamp, string status, string ipfsHash, address verifiedBy)[])"];

// Helper to get description (Kept your original logic)
const getPhaseDescription = (phaseIndex: number, category: ProjectCategory): string => {
  const descriptions: Record<number, Record<string, string>> = {
    0: { 
      [ProjectCategory.HOSPITAL]: "Conducting structural integrity assessments and sourcing medical-grade HVAC systems.",
      [ProjectCategory.SCHOOL]: "Designing modular classroom layouts and ensuring safe play area designations.",
      [ProjectCategory.HOUSING]: "Verifying plot boundaries and sourcing rapid-deploy insulation materials.",
      [ProjectCategory.INFRASTRUCTURE]: "Surveying utility lines and calculating load requirements for the grid.",
      "default": "Initial site surveys and architectural blueprint finalization."
    },

    1: { "default": "Site clearing, debris removal, and foundation pouring." },
    2: { "default": "Main structural assembly and core system installation." },
    3: { "default": "Final touches, safety checks, and handover preparation." }
  };
  const specific = descriptions[phaseIndex]?.[category];
  return specific || descriptions[phaseIndex]?.["default"] || "Proceeding with scheduled works.";
};

export const ProjectStatusTracker: React.FC<ProjectStatusTrackerProps> = ({ projectId, currentPhase, category }) => {
  
  // --- NEW: Blockchain State ---
  const [isOracleVerified, setIsOracleVerified] = useState(false);
  const [latestOnchainStatus, setLatestOnchainStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        // Fetch updates for this ID
        const updates = await contract.getProjectUpdates(projectId);

        // Logic: If there is at least one update on-chain, we mark this project as "Verified"
        if (updates && updates.length > 0) {
          setIsOracleVerified(true);
          const last = updates[updates.length - 1];
          if (last?.status) {
            setLatestOnchainStatus(last.status);
          }
        }
      } catch (e) {
        console.warn("Blockchain sync failed (ignoring for UI)", e);
      }
    };
    checkVerification();
  }, [projectId]);

  return (
    <div className="relative">
      {PROJECT_PHASES.map((phase, index) => {
        const isCompleted = index < currentPhase;
        const isActive = index === currentPhase;
        const isFuture = index > currentPhase;

        return (
          <div key={phase} className="flex gap-4 pb-8 last:pb-0 relative">
            {/* Connecting Line */}
            {index !== PROJECT_PHASES.length - 1 && (
              <div 
                className={`absolute top-8 left-4 w-0.5 h-[calc(100%-1rem)] -translate-x-1/2 transition-colors duration-500 ${
                  isCompleted ? 'bg-[#28A745]' : 'bg-slate-200'
                }`} 
              />
            )}

            {/* Icon Column */}
            <div className="relative z-10 flex-shrink-0">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#28A745] border-[#28A745] text-white shadow-md shadow-green-100' 
                    : isActive 
                      ? 'bg-white border-[#003D66] text-[#003D66] shadow-lg shadow-blue-100 scale-110' 
                      : 'bg-slate-50 border-slate-300 text-slate-300'
                }`}
              >
                {isCompleted && <CheckCircle className="h-5 w-5" />}
                {isActive && <Loader2 className="h-5 w-5 animate-spin" />}
                {isFuture && <Circle className="h-5 w-5" />}
              </div>
            </div>

            {/* Content Column */}
            <div className={`pt-1 transition-opacity duration-500 ${isFuture ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`text-sm font-bold uppercase tracking-wide ${
                  isActive ? 'text-[#003D66]' : isCompleted ? 'text-[#28A745]' : 'text-slate-500'
                }`}>
                  {isActive && <span className="mr-2 text-[#003D66] animate-pulse">● Current Phase:</span>}
                  {phase}
                </h4>

                {/* --- NEW: The Truth Layer Badge --- */}
                {isActive && isOracleVerified && (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 animate-in fade-in zoom-in">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ORACLE VERIFIED</span>
                  </div>
                )}
              </div>
              
              {isActive && latestOnchainStatus && (
                <p className="text-sm text-emerald-700 font-semibold">
                  On-chain status: {latestOnchainStatus}
                </p>
              )}
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {getPhaseDescription(index, category)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
