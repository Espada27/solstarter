use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectError {
    #[msg("The project is not in the Ongoing status.")]
    ProjectNotOngoing,
    #[msg("The project deadline has been reached")]
    DeadlineReached,
}

#[error_code]
pub enum TransferError {
    #[msg("Transfer of funds failed")]
    TransferFailed,
}
