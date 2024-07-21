use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectError {
    #[msg("The project is not in the Ongoing status.")]
    ProjectNotOngoing,
}

#[error_code]
pub enum TransferError {
    #[msg("Transfer of funds failed")]
    TransferFailed,
}

#[error_code]
pub enum WithdrawError {
    #[msg("Invalid amount found. Withdraw aborted.")]
    InvalidAmountToWithdraw,
    #[msg("Goal amount not reached. Withdraw aborted.")]
    UnreachedGoalAmount,
    #[msg("Project status must be Completed. Withdraw aborted.")]
    InvalidProjectStatus,
    #[msg("Contribution accounts did not match project contributions counter. Withdraw aborted.")]
    NotEqualContributionCounter,
}
